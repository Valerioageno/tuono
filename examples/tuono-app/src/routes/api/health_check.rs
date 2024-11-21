use tuono_lib::Request;
use tuono_lib::axum::http::StatusCode;

#[tuono_lib::api(GET)]
pub async fn my_get_request(_req: Request) -> StatusCode {
    StatusCode::OK
}
