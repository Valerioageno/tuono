// src/routes/index.rs
use serde::{Deserialize, Serialize};
use tuono_lib::{Request, Response};

const ALL_POKEMON: &str = "https://pokeapi.co/api/v2/pokemon?limit=151";

#[derive(Debug, Serialize, Deserialize)]
struct Pokemons {
    results: Vec<Pokemon>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Pokemon {
    name: String,
    url: String,
}

#[tuono_lib::handler]
async fn get_all_pokemons(_req: Request<'_>, fetch: reqwest::Client) -> Response {
    return match fetch.get(ALL_POKEMON).send().await {
        Ok(res) => {
            let data = res.json::<Pokemons>().await.unwrap();
            Response::Props(Box::new(data))
        }
        Err(_err) => Response::Props(Box::new(Pokemons { results: vec![] })),
    };
}
