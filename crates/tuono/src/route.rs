use regex::Regex;

fn has_dynamic_path(route: &str) -> bool {
    let regex = Regex::new(r"\[(.*?)\]").expect("Failed to create the regex");
    regex.is_match(route)
}

#[derive(Debug, PartialEq, Eq)]
pub struct Route {
    // Path for importing the module
    pub module_import: String,
    // path for the the axum router
    pub axum_route: String,
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
