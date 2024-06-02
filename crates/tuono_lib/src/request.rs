use serde::Serialize;
use std::collections::HashMap;

use axum::http::{HeaderMap, Uri};

#[derive(Debug, Clone)]
pub struct Request<'a> {
    uri: &'a Uri,
    headers: &'a HeaderMap,
    pub params: HashMap<String, String>,
}

/// Location must match client side interface
#[derive(Serialize, Debug)]
pub struct Location<'a> {
    href: String,
    pathname: &'a str,
    search: HashMap<String, String>,
    search_str: &'a str,
    /// Server does not need it. Will be hanlder client side
    hash: &'a str,
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

    pub fn location(&self) -> Location<'a> {
        Location {
            href: self.uri.to_string(),
            pathname: &self.uri.path(),
            // TODO: hanler search map
            search: HashMap::new(),
            search_str: &self.uri.query().unwrap_or(""),
            hash: "",
        }
    }
}
