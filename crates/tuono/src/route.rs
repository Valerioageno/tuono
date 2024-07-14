use regex::Regex;

fn has_dynamic_path(route: &str) -> bool {
    let regex = Regex::new(r"\[(.*?)\]").expect("Failed to create the regex");
    regex.is_match(route)
}

#[derive(PartialEq)]
pub enum FileType {
    Javascript,
    Rust,
}

#[derive(Debug, PartialEq, Eq)]
pub struct Route {
    pub has_server_handler: bool,
    // Path for importing the module
    pub module_import: String,
    // path for the the axum router
    pub axum_route: String,
}

impl Route {
    pub fn new(path: &str, file_type: FileType) -> Self {
        dbg!(path);
        // Remove first slash
        let mut module = path.chars();
        module.next();

        let axum_route = path.replace("/index", "");

        if axum_route.is_empty() {
            return Route {
                has_server_handler: file_type == FileType::Rust,
                module_import: module.as_str().to_string().replace('/', "_"),
                axum_route: "/".to_string(),
            };
        }

        if has_dynamic_path(path) {
            return Route {
                has_server_handler: file_type == FileType::Rust,
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
            has_server_handler: file_type == FileType::Rust,
            module_import: module.as_str().to_string().replace('/', "_").to_lowercase(),
            axum_route,
        }
    }
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
}
