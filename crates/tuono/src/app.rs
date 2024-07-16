use glob::glob;
use glob::GlobError;
use std::collections::{hash_map::Entry, HashMap};
use std::path::PathBuf;

use crate::route::Route;

const IGNORE_EXTENSIONS: [&str; 3] = ["css", "scss", "sass"];
const IGNORE_FILES: [&str; 1] = ["__root"];

#[derive(Debug)]
pub struct App {
    pub route_map: HashMap<String, Route>,
    pub base_path: PathBuf,
}

impl App {
    pub fn new() -> Self {
        let base_path = std::env::current_dir().unwrap();

        let mut app = App {
            route_map: HashMap::new(),
            base_path,
        };

        app.collect_routes();

        app
    }

    fn collect_routes(&mut self) {
        glob(self.base_path.join("src/routes/**/*.*").to_str().unwrap())
            .expect("Failed to read glob pattern")
            .for_each(|entry| {
                if self.should_collect_route(&entry) {
                    self.collect_route(entry)
                }
            })
    }

    fn should_collect_route(&self, entry: &Result<PathBuf, GlobError>) -> bool {
        let file_extension = entry.as_ref().unwrap().extension().unwrap();
        let file_name = entry.as_ref().unwrap().file_stem().unwrap();

        if IGNORE_EXTENSIONS.iter().any(|val| val == &file_extension) {
            return false;
        }

        if IGNORE_FILES.iter().any(|val| val == &file_name) {
            return false;
        }
        true
    }

    fn collect_route(&mut self, path_buf: Result<PathBuf, GlobError>) {
        let entry = path_buf.unwrap();
        let base_path_str = self.base_path.to_str().unwrap();
        let path = entry
            .to_str()
            .unwrap()
            .replace(&format!("{base_path_str}/src/routes"), "")
            .replace(".rs", "")
            .replace(".tsx", "");

        if entry.extension().unwrap() == "rs" {
            if let Entry::Vacant(route_map) = self.route_map.entry(path.clone()) {
                let mut route = Route::new(path);
                route.update_axum_info();
                route_map.insert(route);
            } else {
                let route = self.route_map.get_mut(&path).unwrap();
                route.update_axum_info();
            }
            return;
        }
        if let Entry::Vacant(route_map) = self.route_map.entry(path.clone()) {
            let route = Route::new(path);
            route_map.insert(route);
        }
    }
}

#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    fn should_collect_routes() {
        let mut app = App::new();
        app.base_path = "/home/user/Documents/tuono".into();

        let routes = [
            "/home/user/Documents/tuono/src/routes/about.rs",
            "/home/user/Documents/tuono/src/routes/index.rs",
            "/home/user/Documents/tuono/src/routes/posts/index.rs",
            "/home/user/Documents/tuono/src/routes/posts/[post].rs",
            "/home/user/Documents/tuono/src/routes/posts/UPPERCASE.rs",
        ];

        routes
            .into_iter()
            .for_each(|route| app.collect_route(Ok(PathBuf::from(route))));

        let results = [
            ("/index", "index"),
            ("/about", "about"),
            ("/posts/index", "posts_index"),
            ("/posts/[post]", "posts_dyn_post"),
            ("/posts/UPPERCASE", "posts_uppercase"),
        ];

        results.into_iter().for_each(|(path, module_import)| {
            assert_eq!(
                app.route_map
                    .get(path)
                    .unwrap()
                    .axum_info
                    .as_ref()
                    .unwrap()
                    .module_import,
                String::from(module_import)
            )
        })
    }

    #[test]
    fn should_create_multi_level_axum_paths() {
        let mut app = App::new();
        app.base_path = "/home/user/Documents/tuono".into();

        let routes = [
            "/home/user/Documents/tuono/src/routes/about.rs",
            "/home/user/Documents/tuono/src/routes/index.rs",
            "/home/user/Documents/tuono/src/routes/posts/index.rs",
            "/home/user/Documents/tuono/src/routes/posts/any-post.rs",
            "/home/user/Documents/tuono/src/routes/posts/[post].rs",
        ];

        routes
            .into_iter()
            .for_each(|route| app.collect_route(Ok(PathBuf::from(route))));

        let results = [
            ("/index", "/"),
            ("/about", "/about"),
            ("/posts/index", "/posts"),
            ("/posts/any-post", "/posts/any-post"),
            ("/posts/[post]", "/posts/:post"),
        ];

        results.into_iter().for_each(|(path, expected_path)| {
            assert_eq!(
                app.route_map
                    .get(path)
                    .unwrap()
                    .axum_info
                    .as_ref()
                    .unwrap()
                    .axum_route,
                String::from(expected_path)
            )
        })
    }

    #[test]
    fn should_ignore_whitelisted_extensions() {
        let mut app = App::new();
        app.base_path = "/home/user/Documents/tuono".into();

        let routes = [
            "/home/user/Documents/tuono/src/routes/about.css",
            "/home/user/Documents/tuono/src/routes/index.scss",
            "/home/user/Documents/tuono/src/routes/posts/index.sass",
        ];

        routes.into_iter().for_each(|route| {
            if app.should_collect_route(&Ok(PathBuf::from(route))) {
                app.collect_route(Ok(PathBuf::from(route)))
            }
        });

        assert!(app.route_map.is_empty())
    }

    #[test]
    fn should_ignore_whitelisted_files() {
        let mut app = App::new();
        app.base_path = "/home/user/Documents/tuono".into();

        let routes = [
            "/home/user/Documents/tuono/src/routes/__root.tsx",
            "/home/user/Documents/tuono/src/routes/posts/__root.tsx",
        ];

        routes.into_iter().for_each(|route| {
            if app.should_collect_route(&Ok(PathBuf::from(route))) {
                app.collect_route(Ok(PathBuf::from(route)))
            }
        });

        assert!(app.route_map.is_empty())
    }

    #[test]
    fn should_correctly_parse_routes_with_server_handler() {
        let mut app = App::new();
        app.base_path = "/home/user/Documents/tuono".into();

        let routes = [
            "/home/user/Documents/tuono/src/routes/about.rs",
            "/home/user/Documents/tuono/src/routes/about.tsx",
            "/home/user/Documents/tuono/src/routes/index.tsx",
        ];

        routes
            .into_iter()
            .for_each(|route| app.collect_route(Ok(PathBuf::from(route))));

        let results = [("/about", true), ("/index", false)];

        results
            .into_iter()
            .for_each(|(path, expected_has_server_handler)| {
                if expected_has_server_handler {
                    assert!(app.route_map.get(path).unwrap().axum_info.is_some())
                } else {
                    assert!(app.route_map.get(path).unwrap().axum_info.is_none())
                }
            })
    }
}
