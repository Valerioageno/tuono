
// File automatically generated
// Do not manually change it

use tuono_lib::{tokio, Mode, Server, axum::Router};
use tuono_lib::axum::routing::get;
use tuono_lib::axum::routing::post;


const MODE: Mode = Mode::Dev;

// MODULE_IMPORTS
#[path="../src/routes/index.rs"]
                    mod index;
                    


#[tokio::main]
async fn main() {
    println!("\n  ⚡ Tuono v0.16.1");

    

    let router = Router::new()
        // ROUTE_BUILDER
.route("/", get(index::get__tuono_internal_api)).route("/", post(index::post__tuono_internal_api))        ;

    Server::init(router, MODE).start().await
}
