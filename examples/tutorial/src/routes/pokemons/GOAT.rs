// src/routes/pokemons/GOAT.rs
use tuono_lib::{reqwest::Client, Request, Response};

#[tuono_lib::handler]
async fn redirect_to_goat(_: Request<'_>, _: Client) -> Response {
    Response::Redirect("/pokemons/mewtwo".to_string())
}
