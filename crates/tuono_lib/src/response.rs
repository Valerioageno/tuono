use crate::Request;
use crate::{ssr::Js, Payload};
use axum::http::StatusCode;
use axum::response::{Html, IntoResponse};
use axum::Json;
use erased_serde::Serialize;

pub struct Props {
    data: Box<dyn Serialize>,
    http_code: StatusCode,
}

pub enum Response {
    Redirect(String),
    Props(Props),
}

impl Props {
    pub fn new(data: impl Serialize + 'static) -> Self {
        Props {
            data: Box::new(data),
            http_code: StatusCode::OK,
        }
    }
}

impl Response {
    pub fn render_to_string(&self, req: Request) -> impl IntoResponse {
        match self {
            Self::Props(Props { data, http_code: _ }) => {
                let payload = Payload::new(&req, data).client_payload().unwrap();

                match Js::SSR.with(|ssr| ssr.borrow_mut().render_to_string(Some(&payload))) {
                    Ok(html) => Html(html),
                    Err(_) => Html("500 Internal server error".to_string()),
                }
            }
            // TODO: Handle here other enum arms
            _ => todo!(),
        }
    }

    pub fn json(&self) -> impl IntoResponse {
        match self {
            Self::Props(Props { data, http_code: _ }) => Json(data).into_response(),
            _ => axum::Json("").into_response(),
        }
    }
}
