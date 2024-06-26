use glob::glob;
use glob::GlobError;
use regex::Regex;
use std::collections::HashMap;
use std::fs;
use std::io;
use std::io::prelude::*;
use std::path::Path;
use std::path::PathBuf;

#[derive(PartialEq, Eq)]
pub enum Mode {
    Prod,
    Dev,
}

impl Mode {
    pub fn as_str<'a>(&self) -> &'a str {
        if *self == Mode::Dev {
            return "Mode::Dev";
        }
        "Mode::Prod"
    }
}

pub const SERVER_ENTRY_DATA: &str = "// File automatically generated by tuono
// Do not manually update this file
import { routeTree } from './routeTree.gen'
import { serverSideRendering } from 'tuono/ssr'

export const renderFn = serverSideRendering(routeTree)
";

pub const CLIENT_ENTRY_DATA: &str = "// File automatically generated by tuono
// Do not manually update this file
import 'vite/modulepreload-polyfill'
import { hydrate } from 'tuono/hydration'
import '../src/styles/global.css'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

hydrate(routeTree)
";

pub const AXUM_ENTRY_POINT: &str = r##"
// File automatically generated
// Do not manually change it

use axum::extract::{Path, Request};
use axum::response::Html;
use axum::{routing::get, Router};
use tower_http::services::ServeDir;
use std::collections::HashMap;
use tuono_lib::{ssr, Ssr, Mode, GLOBAL_MODE, manifest::load_manifest};
use reqwest::Client;

const MODE: Mode = /*MODE*/;

// MODULE_IMPORTS

#[tokio::main]
async fn main() {
    Ssr::create_platform();

    let fetch = Client::new();

    GLOBAL_MODE.set(MODE).unwrap();

    if MODE == Mode::Prod {
        load_manifest()
    }

    let app = Router::new()
        // ROUTE_BUILDER
        .fallback_service(ServeDir::new("/*public_dir*/").fallback(get(catch_all)))
        .with_state(fetch);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    if MODE == Mode::Dev {
        println!("\nDevelopment app ready at http://localhost:3000/");
    } else {
        println!("\nProduction app ready at http://localhost:3000/");
    }
    axum::serve(listener, app).await.unwrap();
}

async fn catch_all(Path(params): Path<HashMap<String, String>>, request: Request) -> Html<String> {
    let pathname = &request.uri();
    let headers = &request.headers();

    let req = tuono_lib::Request::new(pathname, headers, params);


    // TODO: remove unwrap
    let payload = tuono_lib::Payload::new(&req, &"")
        .client_payload()
        .unwrap();

    let result = ssr::Js::SSR.with(|ssr| ssr.borrow_mut().render_to_string(Some(&payload)));

    match result {
        Ok(html) => Html(html),
        _ => Html("500 internal server error".to_string()),
    }
}
"##;

const ROOT_FOLDER: &str = "src/routes";
const DEV_FOLDER: &str = ".tuono";
const DEV_PUBLIC_DIR: &str = "public";
const PROD_PUBLIC_DIR: &str = "out/client";

#[derive(Debug, PartialEq, Eq)]
struct Route {
    /// Every module import is the path with a _ instead of /
    pub module_import: String,
    pub axum_route: String,
}

fn has_dynamic_path(route: &str) -> bool {
    let regex = Regex::new(r"\[(.*?)\]").expect("Failed to create the regex");
    regex.is_match(route)
}

impl Route {
    pub fn new(path: &str) -> Self {
        let route_name = path.replace(".rs", "");
        // Remove first slash
        let mut module = route_name.as_str().chars();
        module.next();

        let axum_route = path.replace("/index.rs", "").replace(".rs", "");

        if axum_route.is_empty() {
            return Route {
                module_import: module.as_str().to_string().replace('/', "_"),
                axum_route: "/".to_string(),
            };
        }

        if has_dynamic_path(&route_name) {
            return Route {
                module_import: module
                    .as_str()
                    .to_string()
                    .replace('/', "_")
                    .replace('[', "dyn_")
                    .replace(']', ""),
                axum_route: axum_route.replace('[', ":").replace(']', ""),
            };
        }

        Route {
            module_import: module.as_str().to_string().replace('/', "_").to_lowercase(),
            axum_route,
        }
    }
}

struct SourceBuilder {
    route_map: HashMap<PathBuf, Route>,
    base_path: PathBuf,
}

impl SourceBuilder {
    pub fn new() -> Self {
        let base_path = std::env::current_dir().unwrap();

        SourceBuilder {
            route_map: HashMap::new(),
            base_path,
        }
    }

    fn collect_routes(&mut self) {
        glob(self.base_path.join("src/routes/**/*.rs").to_str().unwrap())
            .unwrap()
            .for_each(|entry| self.collect_route(entry))
    }

    fn collect_route(&mut self, path_buf: Result<PathBuf, GlobError>) {
        let entry = path_buf.unwrap();
        let base_path_str = self.base_path.to_str().unwrap();
        let path = entry
            .to_str()
            .unwrap()
            .replace(&format!("{base_path_str}/src/routes"), "");

        let route = Route::new(&path);

        self.route_map.insert(PathBuf::from(path), route);
    }
}

fn create_main_file(base_path: &Path, bundled_file: &String) {
    let mut data_file =
        fs::File::create(base_path.join(".tuono/main.rs")).expect("creation failed");

    data_file
        .write_all(bundled_file.as_bytes())
        .expect("write failed");
}

fn create_routes_declaration(routes: &HashMap<PathBuf, Route>) -> String {
    let mut route_declarations = String::from("// ROUTE_BUILDER\n");

    for (_, route) in routes.iter() {
        let Route {
            axum_route,
            module_import,
        } = &route;

        route_declarations.push_str(&format!(
            r#".route("{axum_route}", get({module_import}::route))"#
        ));
        route_declarations.push_str(&format!(
            r#".route("/__tuono/data{axum_route}", get({module_import}::api))"#
        ));
    }

    route_declarations
}

fn create_modules_declaration(routes: &HashMap<PathBuf, Route>) -> String {
    let mut route_declarations = String::from("// MODULE_IMPORTS\n");

    for (path, route) in routes.iter() {
        let module_name = &route.module_import;
        let path_str = path.to_str().unwrap();
        route_declarations.push_str(&format!(
            r#"#[path="../{ROOT_FOLDER}{path_str}"]
mod {module_name};
"#
        ))
    }

    route_declarations
}

pub fn bundle_axum_source(mode: Mode) -> io::Result<()> {
    let base_path = std::env::current_dir().unwrap();

    let mut source_builder = SourceBuilder::new();

    source_builder.collect_routes();

    let bundled_file = generate_axum_source(&source_builder, mode);

    create_main_file(&base_path, &bundled_file);

    Ok(())
}

fn generate_axum_source(source_builder: &SourceBuilder, mode: Mode) -> String {
    let public_dir = if mode == Mode::Prod {
        PROD_PUBLIC_DIR
    } else {
        DEV_PUBLIC_DIR
    };

    AXUM_ENTRY_POINT
        .replace(
            "// ROUTE_BUILDER\n",
            &create_routes_declaration(&source_builder.route_map),
        )
        .replace(
            "// MODULE_IMPORTS\n",
            &create_modules_declaration(&source_builder.route_map),
        )
        .replace("/*public_dir*/", public_dir)
        .replace("/*MODE*/", mode.as_str())
}

pub fn check_tuono_folder() -> io::Result<()> {
    let dev_folder = Path::new(DEV_FOLDER);
    if !&dev_folder.is_dir() {
        fs::create_dir(dev_folder)?;
    }

    Ok(())
}

pub fn create_client_entry_files() -> io::Result<()> {
    let dev_folder = Path::new(DEV_FOLDER);

    let mut server_entry = fs::File::create(dev_folder.join("server-main.tsx"))?;
    let mut client_entry = fs::File::create(dev_folder.join("client-main.tsx"))?;

    server_entry.write_all(SERVER_ENTRY_DATA.as_bytes())?;
    client_entry.write_all(CLIENT_ENTRY_DATA.as_bytes())?;

    Ok(())
}

#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    fn should_find_dynamic_paths() {
        let routes = [
            ("/home/user/Documents/tuono/src/routes/about.rs", false),
            ("/home/user/Documents/tuono/src/routes/index.rs", false),
            (
                "/home/user/Documents/tuono/src/routes/posts/index.rs",
                false,
            ),
            (
                "/home/user/Documents/tuono/src/routes/posts/[post].rs",
                true,
            ),
        ];

        routes
            .into_iter()
            .for_each(|route| assert_eq!(has_dynamic_path(route.0), route.1));
    }

    #[test]
    fn should_collect_routes() {
        let mut source_builder = SourceBuilder::new();
        source_builder.base_path = "/home/user/Documents/tuono".into();

        let routes = [
            "/home/user/Documents/tuono/src/routes/about.rs",
            "/home/user/Documents/tuono/src/routes/index.rs",
            "/home/user/Documents/tuono/src/routes/posts/index.rs",
            "/home/user/Documents/tuono/src/routes/posts/[post].rs",
            "/home/user/Documents/tuono/src/routes/posts/UPPERCASE.rs",
        ];

        routes
            .into_iter()
            .for_each(|route| source_builder.collect_route(Ok(PathBuf::from(route))));

        let results = [
            ("/index.rs", "index"),
            ("/about.rs", "about"),
            ("/posts/index.rs", "posts_index"),
            ("/posts/[post].rs", "posts_dyn_post"),
            ("/posts/UPPERCASE.rs", "posts_uppercase"),
        ];

        results.into_iter().for_each(|(path, module_import)| {
            assert_eq!(
                source_builder
                    .route_map
                    .get(&PathBuf::from(path))
                    .unwrap()
                    .module_import,
                String::from(module_import)
            )
        })
    }

    #[test]
    fn should_create_multi_level_axum_paths() {
        let mut source_builder = SourceBuilder::new();
        source_builder.base_path = "/home/user/Documents/tuono".into();

        let routes = [
            "/home/user/Documents/tuono/src/routes/about.rs",
            "/home/user/Documents/tuono/src/routes/index.rs",
            "/home/user/Documents/tuono/src/routes/posts/index.rs",
            "/home/user/Documents/tuono/src/routes/posts/any-post.rs",
            "/home/user/Documents/tuono/src/routes/posts/[post].rs",
        ];

        routes
            .into_iter()
            .for_each(|route| source_builder.collect_route(Ok(PathBuf::from(route))));

        let results = [
            ("/index.rs", "/"),
            ("/about.rs", "/about"),
            ("/posts/index.rs", "/posts"),
            ("/posts/any-post.rs", "/posts/any-post"),
            ("/posts/[post].rs", "/posts/:post"),
        ];

        results.into_iter().for_each(|(path, expected_path)| {
            assert_eq!(
                source_builder
                    .route_map
                    .get(&PathBuf::from(path))
                    .unwrap()
                    .axum_route,
                String::from(expected_path)
            )
        })
    }

    #[test]
    fn should_set_the_correct_mode() {
        let source_builder = SourceBuilder::new();

        let dev_bundle = generate_axum_source(&source_builder, Mode::Dev);
        assert!(dev_bundle.contains("const MODE: Mode = Mode::Dev;"));

        let prod_bundle = generate_axum_source(&source_builder, Mode::Prod);

        assert!(prod_bundle.contains("const MODE: Mode = Mode::Prod;"));
    }

    #[test]
    fn should_correctly_print_the_mode_as_str() {
        let dev = Mode::Dev.as_str();
        let prod = Mode::Prod.as_str();
        assert_eq!(dev, "Mode::Dev");
        assert_eq!(prod, "Mode::Prod");
    }

    #[test]
    fn should_replace_the_correct_public_folder_dev() {
        let source_builder = SourceBuilder::new();
        let source = generate_axum_source(&source_builder, Mode::Dev);

        assert!(source.contains(r#"ServeDir::new("public")"#))
    }

    #[test]
    fn should_replace_the_correct_public_folder_prod() {
        let source_builder = SourceBuilder::new();
        let source = generate_axum_source(&source_builder, Mode::Prod);

        assert!(source.contains(r#"ServeDir::new("out/client")"#))
    }
}
