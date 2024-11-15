use crate::manifest::load_manifest;
use crate::mode::{Mode, GLOBAL_MODE};
use crate::services::logger::LoggerLayer;
use axum::routing::{get, Router};
use colored::Colorize;
use ssr_rs::Ssr;
use tower_http::services::ServeDir;

use crate::{
    catch_all::catch_all, vite_reverse_proxy::vite_reverse_proxy,
    vite_websocket_proxy::vite_websocket_proxy,
};

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
            println!("  Ready at: {}\n", "http://localhost:3000".blue().bold());
            let router = self
                .router
                .to_owned()
                .layer(LoggerLayer::new())
                .route("/vite-server/", get(vite_websocket_proxy))
                .route("/vite-server/*path", get(vite_reverse_proxy))
                .fallback_service(ServeDir::new(DEV_PUBLIC_DIR).fallback(get(catch_all)))
                .with_state(fetch);

            axum::serve(listener, router)
                .await
                .expect("Failed to serve development server");
        } else {
            println!(
                "  Production server at: {}\n",
                "http://localhost:3000".blue().bold()
            );
            let router = self
                .router
                .to_owned()
                .layer(LoggerLayer::new())
                .fallback_service(ServeDir::new(PROD_PUBLIC_DIR).fallback(get(catch_all)))
                .with_state(fetch);

            axum::serve(listener, router)
                .await
                .expect("Failed to serve production server");
        }
    }
}
