use crate::Request;
use crate::{ssr::Js, Payload};
use axum::http::StatusCode;
use axum::response::{Html, IntoResponse, Redirect, Response as AxumResponse};
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

    pub fn new_with_status(data: impl Serialize + 'static, http_code: StatusCode) -> Self {
        Props {
            data: Box::new(data),
            http_code,
        }
    }
}

impl Response {
    pub fn render_to_string(&self, req: Request) -> AxumResponse {
        match self {
            Self::Props(Props { data, http_code }) => {
                let payload = Payload::new(&req, data).client_payload().unwrap();

                match Js::SSR.with(|ssr| ssr.borrow_mut().render_to_string(Some(&payload))) {
                    Ok(html) => (*http_code, Html(html)).into_response(),
                    Err(_) => {
                        (*http_code, Html("500 Internal server error".to_string())).into_response()
                    }
                }
            }
            Self::Redirect(to) => Redirect::permanent(to).into_response(),
        }
    }

    pub fn json(&self) -> impl IntoResponse {
        match self {
            Self::Props(Props { data, http_code }) => (*http_code, Json(data)).into_response(),
            _ => (StatusCode::INTERNAL_SERVER_ERROR, axum::Json("{}")).into_response(),
        }
    }
}
