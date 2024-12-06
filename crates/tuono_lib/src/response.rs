use crate::Request;
use crate::{ssr::Js, Payload};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{Html, IntoResponse, Redirect};
use axum::Json;
use axum_extra::extract::cookie::{Cookie, CookieJar};
use erased_serde::Serialize;

pub struct Props {
    data: Box<dyn Serialize>,
    http_code: StatusCode,
    cookies: CookieJar,
}

pub enum Response {
    Redirect(String),
    Props(Props),
    // TODO: improve this tuple to support a more generic IntoResponse
    Custom((StatusCode, HeaderMap, String)),
}

#[derive(serde::Serialize)]
struct JsonResponseInfo {
    redirect_destination: Option<String>,
}

impl JsonResponseInfo {
    fn new(redirect_destination: Option<String>) -> JsonResponseInfo {
        JsonResponseInfo {
            redirect_destination,
        }
    }
}

#[derive(serde::Serialize)]
struct JsonResponse<'a> {
    data: Option<&'a dyn Serialize>,
    info: JsonResponseInfo,
}

impl<'a> JsonResponse<'a> {
    fn new(props: &'a dyn Serialize) -> Self {
        JsonResponse {
            data: Some(props),
            info: JsonResponseInfo::new(None),
        }
    }

    fn new_redirect(destination: String) -> Self {
        JsonResponse {
            data: None,
            info: JsonResponseInfo::new(Some(destination)),
        }
    }
}

impl Props {
    pub fn new(data: impl Serialize + 'static) -> Self {
        Props {
            data: Box::new(data),
            http_code: StatusCode::OK,
            cookies: CookieJar::new(),
        }
    }

    pub fn status(&mut self, http_code: StatusCode) {
        self.http_code = http_code;
    }

    pub fn new_with_status(data: impl Serialize + 'static, http_code: StatusCode) -> Self {
        Props {
            data: Box::new(data),
            http_code,
            cookies: CookieJar::new(),
        }
    }

    pub fn add_cookie(&mut self, cookie: Cookie) {
        let jar = self.cookies.clone().add(cookie.into_owned());
        self.cookies = jar
    }
}

impl Response {
    pub fn render_to_string(&self, req: Request) -> impl IntoResponse {
        match self {
            Self::Props(Props {
                data,
                http_code,
                cookies,
            }) => {
                let payload = Payload::new(&req, data.as_ref()).client_payload().unwrap();

                match Js::render_to_string(Some(&payload)) {
                    Ok(html) => (*http_code, cookies.clone(), Html(html)),
                    Err(_) => (
                        *http_code,
                        cookies.clone(),
                        Html("500 Internal server error".to_string()),
                    ),
                }
                .into_response()
            }
            Self::Redirect(to) => Redirect::permanent(to).into_response(),
            Self::Custom(response) => response.clone().into_response(),
        }
    }

    pub fn json(&self) -> impl IntoResponse {
        match self {
            Self::Props(Props {
                data,
                http_code,
                cookies,
            }) => (
                *http_code,
                cookies.clone(),
                Json(JsonResponse::new(data.as_ref())),
            )
                .into_response(),
            Self::Redirect(destination) => (
                StatusCode::PERMANENT_REDIRECT,
                Json(JsonResponse::new_redirect(destination.to_string())),
            )
                .into_response(),
            // Custom never needs the "data" response since its scope
            // is outside the react domain
            Self::Custom(_) => (StatusCode::OK, Json("{}")).into_response(),
        }
    }
}
