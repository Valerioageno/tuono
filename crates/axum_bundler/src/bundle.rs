use glob::glob;
use std::collections::HashMap;
use std::fs;
use std::io::prelude::*;
use std::path::Path;
use std::path::PathBuf;

const ROOT_FOLDER: &'static str = "src/routes";

const AXUM_ENTRY_POINT: &'static str = r##"
// File automatically generated
// Do not manually change it

use axum::extract::Request;
use axum::response::Html;
use axum::{routing::get, Router};
use tower_http::services::ServeDir;
use tuono_lib::{ssr, Ssr};

// MODULE_IMPORTS

#[tokio::main]
async fn main() {
    Ssr::create_platform();

    let app = Router::new()
        // ROUTE_BUILDER
        .nest_service("/__tuono", ServeDir::new(".tuono"))
        .fallback_service(ServeDir::new("public").fallback(get(catch_all)));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn catch_all(request: Request) -> Html<String> {
    let pathname = &request.uri();
    let headers = &request.headers();

    let req = tuono_lib::Request::new(pathname, headers);


    // TODO: remove unwrap
    let payload = tuono_lib::Payload::new(&req, Box::new(""))
        .client_payload()
        .unwrap();

    let result = ssr::Js::SSR.with(|ssr| ssr.borrow_mut().render_to_string(Some(&payload)));

    match result {
        Ok(html) => Html(html),
        _ => Html("500 internal server error".to_string()),
    }
}
"##;

fn create_main_file(base_path: &Path, bundled_file: &String) {
    let mut data_file =
        fs::File::create(base_path.join(".tuono/main.rs")).expect("creation failed");

    data_file
        .write(bundled_file.as_bytes())
        .expect("write failed");
}

fn get_route_name<'a>(path: &PathBuf, base_path: &Path) -> String {
    let base_path_str = base_path.to_str().unwrap();
    if base_path_str == "." {
        return path.to_str().unwrap().replace("/src/routes/", "");
    }

    // TODO: refactor this horrible code
    if base_path_str.ends_with("/") {
        return path
            .to_str()
            .unwrap()
            .replace(&format!("{base_path_str}src/routes"), "")
            .replace(".rs", "")
            .replace("index", "");
    }

    path.to_str()
        .unwrap()
        .replace(&format!("{base_path_str}/src/routes"), "")
        .replace(".rs", "")
        .replace("index", "")
}

fn collect_handlers(base_path: &Path) -> HashMap<String, String> {
    // <path, name>
    let mut mods_map: HashMap<String, String> = HashMap::new();

    let _: Vec<_> = glob(base_path.join("src/routes/**/*.rs").to_str().unwrap())
        .unwrap()
        .map(|entry| {
            let entry = entry.unwrap();

            let route_name = get_route_name(&entry, base_path);

            // Remove first slash
            let mut module = route_name.as_str().chars();
            module.next();

            mods_map.insert(
                module.as_str().to_string(),
                entry
                    .to_str()
                    .unwrap()
                    .replace(base_path.to_str().unwrap(), ""),
            );
        })
        .collect();

    dbg!(&mods_map);

    return mods_map;
}

fn create_axum_routes_declaration(routes: &HashMap<String, String>) -> String {
    let mut route_declarations = String::from("// ROUTE_BUILDER\n");

    for (route, _path) in routes.iter() {
        route_declarations.push_str(&format!(r#".route("/{route}", get({route}::route))"#))
    }

    route_declarations
}

fn create_modules_declaration(routes: &HashMap<String, String>) -> String {
    let mut route_declarations = String::from("// MODULE_IMPORTS\n");

    for (route, path) in routes.iter() {
        route_declarations.push_str(&format!(
            r#"#[path="..{path}"]
mod {route};
"#
        ))
    }

    route_declarations
}

pub fn bundle_axum_source() {
    println!("Axum project bundling");

    let base_path = std::env::current_dir().unwrap();

    let mods = collect_handlers(&base_path);

    let bundled_file = AXUM_ENTRY_POINT
        .replace("// ROUTE_BUILDER\n", &create_axum_routes_declaration(&mods))
        .replace("// MODULE_IMPORTS\n", &create_modules_declaration(&mods));

    create_main_file(&base_path, &bundled_file);
}
