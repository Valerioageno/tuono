// src/routes/pokemons/GOAT.rs
use tuono_lib::{Request, Response};

#[tuono_lib::handler]
async fn redirect_to_goat(_req: Request) -> Response {
    Response::Redirect("/pokemons/mewtwo".to_string())
}
