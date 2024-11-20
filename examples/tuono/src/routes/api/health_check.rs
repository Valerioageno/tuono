use tuono_lib::Request;

#[tuono_lib::api(GET)]
pub async fn my_get_request(_req: Request) -> &'static str {
    "(GET) Response"
}

#[tuono_lib::api(POST)]
pub async fn post_request(_req: Request) -> &'static str {
    "(POST) Response"
}
