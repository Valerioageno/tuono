use glob::glob;
use glob::GlobError;
use std::collections::HashMap;
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

        App {
            route_map: HashMap::new(),
            base_path,
        }
    }

    pub fn collect_routes(&mut self) {
        glob(self.base_path.join("src/routes/**/*.*").to_str().unwrap())
            .expect("Failed to read glob pattern")
            .for_each(|entry| {
                let file_extension = entry.as_ref().unwrap().extension().unwrap();

                if IGNORE_EXTENSIONS.iter().any(|val| val == &file_extension) {
                    return;
                }

                if IGNORE_FILES
                    .iter()
                    .any(|val| val == &entry.as_ref().unwrap().file_stem().unwrap())
                {
                    return;
                }

                self.collect_route(entry)
            })
    }

    fn collect_route(&mut self, path_buf: Result<PathBuf, GlobError>) {
        let entry = path_buf.unwrap();
        let base_path_str = self.base_path.to_str().unwrap();
        let path = entry
            .to_str()
            .unwrap()
            .replace(&format!("{base_path_str}/src/routes"), "");

        if path.ends_with(".rs") {
            let route = Route::new(&path);

            self.route_map.insert(path, route);
        }
    }
}

#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    fn should_collect_routes() {
        let mut source_builder = App::new();
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
                source_builder.route_map.get(path).unwrap().module_import,
                String::from(module_import)
            )
        })
    }

    #[test]
    fn should_create_multi_level_axum_paths() {
        let mut source_builder = App::new();
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
                source_builder.route_map.get(path).unwrap().axum_route,
                String::from(expected_path)
            )
        })
    }

    #[test]
    fn should_ignore_whitelisted_extensions() {
        let mut source_builder = App::new();
        source_builder.base_path = "/home/user/Documents/tuono".into();

        let routes = [
            "/home/user/Documents/tuono/src/routes/about.css",
            "/home/user/Documents/tuono/src/routes/index.scss",
            "/home/user/Documents/tuono/src/routes/posts/index.sass",
        ];

        routes
            .into_iter()
            .for_each(|route| source_builder.collect_route(Ok(PathBuf::from(route))));

        assert!(source_builder.route_map.is_empty())
    }

    #[test]
    fn should_ignore_whitelisted_files() {
        let mut source_builder = App::new();
        source_builder.base_path = "/home/user/Documents/tuono".into();

        let routes = [
            "/home/user/Documents/tuono/src/routes/__root.tsx",
            "/home/user/Documents/tuono/src/routes/posts/__root.tsx",
        ];

        routes
            .into_iter()
            .for_each(|route| source_builder.collect_route(Ok(PathBuf::from(route))));

        assert!(source_builder.route_map.is_empty())
    }
}
