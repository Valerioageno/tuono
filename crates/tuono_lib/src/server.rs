use crate::mode::{Mode, GLOBAL_MODE};

use crate::manifest::load_manifest;
use axum::routing::{get, Router};
use ssr_rs::Ssr;
use tower_http::services::ServeDir;

use crate::internal_handlers::{catch_all, vite_reverse_proxy, vite_websocket_proxy};

const DEV_PUBLIC_DIR: &str = "public";
const PROD_PUBLIC_DIR: &str = "out/client";

pub struct Server {
    router: Router<reqwest::Client>,
    mode: Mode,
}

impl Server {
    pub fn init(router: Router<reqwest::Client>, mode: Mode) -> Server {
        Ssr::create_platform();

        GLOBAL_MODE.set(mode).unwrap();

        if mode == Mode::Prod {
            load_manifest()
        }

        Server { router, mode }
    }

    pub async fn start(&self) {
        let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

        let fetch = reqwest::Client::new();

        if self.mode == Mode::Dev {
            println!("\nDevelopment app ready at http://localhost:3000/");
        } else {
            println!("\nProduction app ready at http://localhost:3000/");
        }

        let public_dir = if self.mode == Mode::Dev {
            DEV_PUBLIC_DIR
        } else {
            PROD_PUBLIC_DIR
        };

        let router = self
            .router
            .to_owned()
            .route("/vite-server/", get(vite_websocket_proxy))
            .route("/vite-server/*path", get(vite_reverse_proxy))
            .fallback_service(ServeDir::new(public_dir).fallback(get(catch_all)))
            .with_state(fetch);

        axum::serve(listener, router).await.unwrap();
    }
}
