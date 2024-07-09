use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, ItemFn};

pub fn handler_core(_args: TokenStream, item: TokenStream) -> TokenStream {
    let item = parse_macro_input!(item as ItemFn);

    let fn_name = item.clone().sig.ident;

    quote! {
        use tuono_lib::axum::response::IntoResponse;
        use std::collections::HashMap;
        use tuono_lib::axum::extract::{State, Path};

        #item

        pub async fn route(
            Path(params): Path<HashMap<String, String>>,
            State(client): State<tuono_lib::reqwest::Client>,
            request: tuono_lib::axum::extract::Request
        ) -> impl IntoResponse {
           let pathname = request.uri();
           let headers = request.headers();

           let req = tuono_lib::Request::new(pathname.to_owned(), headers.to_owned(), params);

           #fn_name(req.clone(), client).await.render_to_string(req)
        }

        pub async fn api(
            Path(params): Path<HashMap<String, String>>,
            State(client): State<tuono_lib::reqwest::Client>,
            request: tuono_lib::axum::extract::Request
        ) -> impl IntoResponse{
           let pathname = request.uri();
           let headers = request.headers();

           let req = tuono_lib::Request::new(pathname.to_owned(), headers.to_owned(), params);

           #fn_name(req.clone(), client).await.json()
        }
    }
    .into()
}
