use glob::glob;
use std::collections::HashMap;
use std::fs;
use std::io::prelude::*;
use std::path::Path;
use std::path::PathBuf;

const AXUM_ENTRY_POINT: &'static str = r##"// File automatically generated
// Do not manually change it

use axum::response::Html;
use axum::{routing::get, Router};
use ssr_rs::Ssr;
use std::cell::RefCell;
use std::fs::read_to_string;

thread_local! {
    static SSR: RefCell<Ssr<'static, 'static>> = RefCell::new(
            Ssr::from(
                read_to_string("out/server/server-main.js").unwrap(),
                ""
                ).unwrap()
            )
}

#[tokio::main]
async fn main() {
    Ssr::create_platform();

    let app = Router::new()
        // ROUTE_BUILDER
        .route("/*key", get(catch_all));

    let app = app.fallback("Catch all route");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn catch_all() -> Html<String> {
    let result = SSR.with(|ssr| ssr.borrow_mut().render_to_string(None));
    Html(result.unwrap())
}

// ROUTE_DECLARATIONS

"##;

fn create_main_file(base_path: &Path, bundled_file: &String) {
    let mut data_file =
        fs::File::create(base_path.join(".tuono/main.rs")).expect("creation failed");

    data_file
        .write(bundled_file.as_bytes())
        .expect("write failed");
}

fn clean_up_source_file(file: &mut String) {}

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

fn collect_handlers(base_path: &Path) -> (String, HashMap<String, String>) {
    let mut declarations = String::from("// ROUTE_DECLARATIONS\n");
    let mut fn_map: HashMap<String, String> = HashMap::new();

    let _: Vec<_> = glob(base_path.join("src/routes/**/*.rs").to_str().unwrap())
        .unwrap()
        .map(|entry| {
            let entry = entry.unwrap();

            let route_name = get_route_name(&entry, base_path);
            let mut file_content = fs::read_to_string(entry).unwrap();
            clean_up_source_file(&mut file_content);
            let hash = fastmurmur3::hash(file_content.as_bytes());
            let new_fn_name = format!("fn_{}", hash);

            let file_content = file_content.replace("get_server_side_props", &new_fn_name);

            fn_map.insert(route_name, new_fn_name);

            declarations.push_str(&file_content);
        })
        .collect();

    println!("{fn_map:?}");

    return (declarations, fn_map);
}

fn create_axum_routes_declaration(routes: HashMap<String, String>) -> String {
    let mut route_declarations = String::from("// ROUTE_BUILDER\n");

    for (route, handler) in routes.iter() {
        route_declarations.push_str(&format!(r#".route("{route}", get({handler}))"#))
    }

    route_declarations
}

pub fn bundle() {
    println!("Axum project bundling");

    let base_path = std::env::current_dir().unwrap();

    let (handlers, fn_map) = collect_handlers(&base_path);

    let bundled_file = AXUM_ENTRY_POINT.replace(
        "// ROUTE_BUILDER\n",
        &create_axum_routes_declaration(fn_map),
    );

    let bundled_file = bundled_file.replace("// ROUTE_DECLARATIONS", &handlers[..]);

    create_main_file(&base_path, &bundled_file);
}
