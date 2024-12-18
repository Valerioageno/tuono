//! ## Tuono
//! Tuono is a full-stack web framework for building React applications using Rust as the backend with a strong focus on usability and performance.
//!
//! You can find the full documentation at [tuono.dev](https://tuono.dev/)

extern crate proc_macro;
use proc_macro::TokenStream;

mod api;
mod handler;
mod utils;

#[proc_macro_attribute]
pub fn handler(args: TokenStream, item: TokenStream) -> TokenStream {
    handler::handler_core(args, item)
}

#[proc_macro_attribute]
pub fn api(args: TokenStream, item: TokenStream) -> TokenStream {
    api::api_core(args, item)
}
