use crate::{ssr::Js, Payload};

use axum::body::Body;
use axum::extract::{Path, Request, State};
use axum::http::{HeaderName, HeaderValue};
use axum::response::{Html, IntoResponse, Response};
use reqwest::Client;
use std::collections::HashMap;

const VITE_URL: &str = "http://localhost:3001/vite-server";

pub async fn catch_all(
    Path(params): Path<HashMap<String, String>>,
    request: Request,
) -> Html<String> {
    let pathname = &request.uri();
    let headers = &request.headers();

    let req = crate::Request::new(pathname, headers, params);

    // TODO: remove unwrap
    let payload = Payload::new(&req, &"").client_payload().unwrap();

    let result = Js::SSR.with(|ssr| ssr.borrow_mut().render_to_string(Some(&payload)));

    match result {
        Ok(html) => Html(html),
        _ => Html("500 internal server error".to_string()),
    }
}

pub async fn vite_reverse_proxy(
    State(client): State<Client>,
    Path(path): Path<String>,
) -> impl IntoResponse {
    match client.get(format!("{VITE_URL}/{path}")).send().await {
        Ok(res) => {
            let mut response_builder = Response::builder().status(res.status().as_u16());

            {
                let headers = response_builder.headers_mut().unwrap();
                res.headers().into_iter().for_each(|(name, value)| {
                    let name = HeaderName::from_bytes(name.as_ref()).unwrap();
                    let value = HeaderValue::from_bytes(value.as_ref()).unwrap();
                    headers.insert(name, value);
                });
            }

            response_builder
                .body(Body::from_stream(res.bytes_stream()))
                .unwrap()
        }
        Err(_) => todo!(),
    }
}
