use regex::Regex;

fn has_dynamic_path(route: &str) -> bool {
    let regex = Regex::new(r"\[(.*?)\]").expect("Failed to create the regex");
    regex.is_match(route)
}

#[derive(Debug, PartialEq, Eq)]
pub struct AxumInfo {
    // Path for importing the module
    pub module_import: String,
    // path for the the axum router
    pub axum_route: String,
}

impl AxumInfo {
    pub fn new(path: String) -> Self {
        // Remove first slash
        let mut module = path.chars();
        module.next();

        let axum_route = path.replace("/index", "");

        if axum_route.is_empty() {
            return AxumInfo {
                module_import: module.as_str().to_string().replace('/', "_"),
                axum_route: "/".to_string(),
            };
        }

        if has_dynamic_path(&path) {
            return AxumInfo {
                module_import: module
                    .as_str()
                    .to_string()
                    .replace('/', "_")
                    .replace('[', "dyn_")
                    .replace(']', ""),
                axum_route: axum_route.replace('[', ":").replace(']', ""),
            };
        }

        AxumInfo {
            module_import: module.as_str().to_string().replace('/', "_").to_lowercase(),
            axum_route,
        }
    }
}

#[derive(Debug, PartialEq, Eq)]
pub struct Route {
    path: String,
    pub is_dynamic: bool,
    pub axum_info: Option<AxumInfo>,
}

impl Route {
    pub fn new(cleaned_path: String) -> Self {
        Route {
            path: cleaned_path.clone(),
            axum_info: None,
            is_dynamic: has_dynamic_path(&cleaned_path),
        }
    }

    pub fn update_axum_info(&mut self) {
        self.axum_info = Some(AxumInfo::new(self.path.clone()))
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

    #[test]
    fn should_correctly_create_the_axum_infos() {
        let info = AxumInfo::new("/index".to_string());

        assert_eq!(info.axum_route, "/");
        assert_eq!(info.module_import, "index");

        let dyn_info = AxumInfo::new("/[posts]".to_string());

        assert_eq!(dyn_info.axum_route, "/:posts");
        assert_eq!(dyn_info.module_import, "dyn_posts");
    }
}
