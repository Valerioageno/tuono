pub mod ssr;
pub use ssr_rs::Ssr;
pub use tuono_lib_macros::handler;

pub enum Response {
    Redirect(String),
    Props(String),
}
