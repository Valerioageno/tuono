use tuono_lib::Request;

#[tuono_lib::api]
pub async fn health_check(_req: Request) -> String {
    "It works".to_string()
}
