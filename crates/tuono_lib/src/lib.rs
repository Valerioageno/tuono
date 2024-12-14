mod catch_all;
mod logger;

mod mode;
mod server;

pub use mode::Mode;
pub use server::Server;
pub use tuono_lib_macros::{api, handler};

// Re-exports
pub use axum;
pub use axum_extra::extract::cookie;
pub use tokio;

mod request;
pub use request::Request;

#[cfg(feature = "ssr")]
#[cfg(feature = "ssr")]
mod manifest;
mod response;

#[cfg(feature = "ssr")]
mod payload;

#[cfg(feature = "ssr")]
pub use payload::Payload;
#[cfg(feature = "ssr")]
pub use response::response::{Props, Response};

#[cfg(feature = "ssr")]
mod ssr;

#[cfg(feature = "ssr")]
mod vite_reverse_proxy;

#[cfg(feature = "ssr")]
mod vite_websocket_proxy;
