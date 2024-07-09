use serde::Serialize;
use tuono_lib::reqwest;
use tuono_lib::{Props, Request, Response};

#[derive(Serialize)]
struct MyResponse<'a> {
    subtitle: &'a str,
}

#[tuono_lib::handler]
async fn get_server_side_props(_req: Request, _fetch: reqwest::Client) -> Response {
    Response::Props(Props::new(MyResponse {
        subtitle: "The react / rust fullstack framework",
    }))
}
