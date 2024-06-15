use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, ItemFn};

pub fn handler_core(_args: TokenStream, item: TokenStream) -> TokenStream {
    let item = parse_macro_input!(item as ItemFn);

    let fn_name = item.clone().sig.ident;

    quote! {
        use axum::response::{Html, IntoResponse};
        use std::collections::HashMap;
        use axum::extract::{State, Path};
        use reqwest::Client;

        #item

        pub async fn route(
            Path(params): Path<HashMap<String, String>>,
            State(client): State<Client>,
            request: axum::extract::Request
        ) -> impl IntoResponse {
           let pathname = &request.uri();
           let headers = &request.headers();

           let req = tuono_lib::Request::new(pathname, headers, params);

           #fn_name(req.clone(), client).await.render_to_string(req)
        }

        pub async fn api(
            Path(params): Path<HashMap<String, String>>,
            State(client): State<Client>,
            request: axum::extract::Request
        ) -> impl IntoResponse{
            let pathname = &request.uri();
           let headers = &request.headers();

           let req = tuono_lib::Request::new(pathname, headers, params);

           #fn_name(req.clone(), client).await.json()
        }
    }
    .into()
}
