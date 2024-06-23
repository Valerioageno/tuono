use serde::Serialize;
use std::collections::HashMap;

use axum::http::{HeaderMap, Uri};

/// Location must match client side interface
#[derive(Serialize, Debug)]
pub struct Location {
    href: String,
    pathname: String,
    search: HashMap<String, String>,
    search_str: String,
    hash: String,
}

impl Location {
    pub fn pathname(&self) -> &String {
        &self.pathname
    }
}

impl<'a> From<&'a Uri> for Location {
    fn from(uri: &Uri) -> Self {
        Location {
            href: uri.to_string(),
            pathname: uri.path().to_string(),
            // TODO: handler search map
            search: HashMap::new(),
            search_str: uri.query().unwrap_or("").to_string(),
            hash: "".to_string(),
        }
    }
}

#[derive(Debug, Clone)]
pub struct Request<'a> {
    uri: &'a Uri,
    pub headers: &'a HeaderMap,
    pub params: HashMap<String, String>,
}

impl<'a> Request<'a> {
    pub fn new(
        uri: &'a Uri,
        headers: &'a HeaderMap,
        params: HashMap<String, String>,
    ) -> Request<'a> {
        Request {
            uri,
            headers,
            params,
        }
    }

    pub fn location(&self) -> Location {
        Location::from(self.uri)
    }
}
