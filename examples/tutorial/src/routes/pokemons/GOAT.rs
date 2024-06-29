// src/routes/pokemons/GOAT.rs
use tuono_lib::{Request, Response};

#[tuono_lib::handler]
async fn redirect_to_goat(_: Request<'_>, _: reqwest::Client) -> Response {
    Response::Redirect("/pokemons/mewtwo".to_string())
}
