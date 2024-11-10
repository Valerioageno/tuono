use crate::{ssr::Js, Payload};
use axum::extract::{Path, Request};
use axum::response::Html;
use colored::*;
use std::collections::HashMap;
use tokio::time::Instant;

pub async fn catch_all(
    Path(params): Path<HashMap<String, String>>,
    request: Request,
) -> Html<String> {
    let start = Instant::now();
    let pathname = request.uri();
    let headers = request.headers();

    let req = crate::Request::new(pathname.to_owned(), headers.to_owned(), params);

    // TODO: remove unwrap
    let payload = Payload::new(&req, &"").client_payload().unwrap();

    let result = Js::render_to_string(Some(&payload));

    let duration = start.elapsed();

    // TODO: handle 404 error on catch_all route
    let http_code = "200";

    println!(
        "  GET {} {} in {}ms",
        req.uri.path(),
        http_code.green(),
        duration.as_millis()
    );

    match result {
        Ok(html) => Html(html),
        _ => Html("500 internal server error".to_string()),
    }
}
