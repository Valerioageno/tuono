use tuono_lib::axum::http::StatusCode;
use tuono_lib::Request;

#[tuono_lib::api(GET)]
pub async fn root_route_api(_req: Request) -> &'static str {
    "get request"
}

#[tuono_lib::api(POST)]
pub async fn root_route_api_post(_req: Request) -> StatusCode {
    StatusCode::OK
}
