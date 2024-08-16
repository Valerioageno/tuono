use rand::prelude::*;
use rand::thread_rng;
use serde::Serialize;
use tuono_lib::reqwest;
use tuono_lib::{Props, Request, Response};

#[derive(Serialize)]
struct MyResponse {
    data: u8,
}

#[tuono_lib::handler]
async fn get_server_side_props(_req: Request, _fetch: reqwest::Client) -> Response {
    let mut rng = thread_rng();
    let data: u8 = rng.gen_range(0..=10);
    Response::Props(Props::new(MyResponse { data }))
}
