use axum::body::Body;
use axum::extract::{Path, State};

use axum::http::{HeaderName, HeaderValue};
use axum::response::{IntoResponse, Response};
use reqwest::Client;

const VITE_URL: &str = "http://localhost:3001/vite-server";

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
