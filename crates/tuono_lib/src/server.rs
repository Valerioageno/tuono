use crate::manifest::load_manifest;
use crate::mode::{Mode, GLOBAL_MODE};
use axum::routing::{get, Router};
use colored::Colorize;
use ssr_rs::Ssr;
use tower_http::services::ServeDir;

use crate::{
    catch_all::catch_all, logger::LoggerLayer, vite_reverse_proxy::vite_reverse_proxy,
    vite_websocket_proxy::vite_websocket_proxy,
};

const DEV_PUBLIC_DIR: &str = "public";
const PROD_PUBLIC_DIR: &str = "out/client";

fn extract_port(addr: &str) -> &str {
    addr.split(":").last().unwrap_or_else(|| {
        eprintln!("  Error: Failed to extract port from address {}", addr);
        std::process::exit(1);
    })
}

pub struct Server {
    router: Router,
    mode: Mode,
}

impl Server {
    pub fn init(router: Router, mode: Mode) -> Server {
        Ssr::create_platform();

        GLOBAL_MODE.set(mode).unwrap();

        if mode == Mode::Prod {
            load_manifest()
        }

        Server { router, mode }
    }

    pub async fn start(&self) {
        let rust_addr = "0.0.0.0:3000";
        let vite_addr = "0.0.0.0:3001";

        // Get the port from the address to be displayed in the console
        let rust_port = extract_port(&rust_addr);
        let vite_port = extract_port(&vite_addr);

        let rust_listener = tokio::net::TcpListener::bind(rust_addr).await;
        let vite_listener = tokio::net::TcpListener::bind(vite_addr).await;

        match (rust_listener, vite_listener) {
            (Ok(rust_listener), Ok(_vite_listener)) => {
                println!("\n  Using port {} for Rust server.", rust_port.bold());
                println!("  Using port {} for Vite server.", vite_port.bold());

                self.serve(rust_listener).await;
            }
            (Err(_listener), _) | (_, Err(_listener)) => {
                eprintln!(
                    "\n  Error: Failed to bind to either port {} or port {}.",
                    rust_port, vite_port
                );
                eprintln!(
                    "  Please ensure that ports {} and {} are not already in use by another process or application.", 
                    rust_port, vite_port
                );

                std::process::exit(1);
            }
        }
    }

    pub async fn serve(&self, listener: tokio::net::TcpListener) {
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
}
