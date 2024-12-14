use crate::mode::{Mode, GLOBAL_MODE};
use axum::routing::Router;
use colored::Colorize;

use crate::logger::LoggerLayer;

#[cfg(feature = "ssr")]
use crate::{
    catch_all::catch_all, vite_reverse_proxy::vite_reverse_proxy,
    vite_websocket_proxy::vite_websocket_proxy,
};

#[cfg(feature = "ssr")]
use crate::manifest::load_manifest;
#[cfg(feature = "ssr")]
use axum::routing::get;
#[cfg(feature = "ssr")]
use ssr_rs::Ssr;
#[cfg(feature = "ssr")]
use tower_http::services::ServeDir;

#[cfg(feature = "ssr")]
const DEV_PUBLIC_DIR: &str = "public";

#[cfg(feature = "ssr")]
const PROD_PUBLIC_DIR: &str = "out/client";

pub struct Server {
    router: Router,
    mode: Mode,
}

impl Server {
    #[cfg(feature = "ssr")]
    pub fn init(router: Router, mode: Mode) -> Server {
        Ssr::create_platform();

        GLOBAL_MODE.set(mode).unwrap();

        if mode == Mode::Prod {
            load_manifest()
        }

        Server { router, mode }
    }

    #[cfg(not(feature = "ssr"))]
    pub fn init(router: Router, mode: Mode) -> Server {
        GLOBAL_MODE.set(mode).unwrap();

        Server { router, mode }
    }

    #[cfg(feature = "ssr")]
    pub async fn start(&self) {
        let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

        if self.mode == Mode::Dev {
            println!("  Ready at: {}\n", "http://localhost:3000".blue().bold());
            let router = self
                .router
                .to_owned()
                .layer(LoggerLayer::new())
                .route("/vite-server/", get(vite_websocket_proxy))
                .route("/vite-server/*path", get(vite_reverse_proxy))
                .fallback_service(
                    ServeDir::new(DEV_PUBLIC_DIR)
                        .fallback(get(catch_all).layer(LoggerLayer::new())),
                );

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
                .fallback_service(
                    ServeDir::new(PROD_PUBLIC_DIR)
                        .fallback(get(catch_all).layer(LoggerLayer::new())),
                );

            axum::serve(listener, router)
                .await
                .expect("Failed to serve production server");
        }
    }

    #[cfg(not(feature = "ssr"))]
    pub async fn start(&self) {
        let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

        if self.mode == Mode::Dev {
            println!("  Ready at: {}\n", "http://localhost:3000".blue().bold());
        } else {
            println!(
                "  Production server at: {}\n",
                "http://localhost:3000".blue().bold()
            );
        }

        let router = self.router.to_owned().layer(LoggerLayer::new());

        axum::serve(listener, router)
            .await
            .expect("Failed to serve production server");
    }
}
