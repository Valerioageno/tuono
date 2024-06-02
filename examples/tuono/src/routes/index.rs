use serde::Serialize;
use tuono_lib::{Request, Response};

#[derive(Serialize)]
struct MyResponse<'a> {
    subtitle: &'a str,
}

#[tuono_lib::handler]
async fn get_server_side_props(_req: Request<'_>, _fetch: reqwest::Client) -> Response {
    Response::Props(Box::new(MyResponse {
        subtitle: "The react / rust fullstack framework",
    }))
}
