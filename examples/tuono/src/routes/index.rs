use serde::Serialize;
use tuono_lib::{Request, Response};

#[derive(Serialize)]
struct MyResponse<'a> {
    title: &'a str,
    subtitle: &'a str,
}

#[tuono_lib::handler]
fn get_server_side_props(req: &Request) -> Response {
    Response::Props(Box::new(MyResponse {
        title: "title",
        subtitle: "subtitle",
    }))
}
