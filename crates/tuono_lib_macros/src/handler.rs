use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, ItemFn};

pub fn handler_core(_args: TokenStream, item: TokenStream) -> TokenStream {
    let item = parse_macro_input!(item as ItemFn);

    let fn_name = item.clone().sig.ident;

    quote! {
        use axum::response::{Html, IntoResponse};

        #item

        pub async fn route(request: axum::extract::Request) -> Html<String> {
           let pathname = &request.uri();
           let headers = &request.headers();

           let req = tuono_lib::Request::new(pathname, headers);

           let local_response = #fn_name(&req);

            let res = match local_response{
                tuono_lib::Response::Props(val) => {

                    // TODO: remove unwrap
                    let payload = tuono_lib::Payload::new(&req, val).client_payload().unwrap();

                    dbg!(&payload);

                    tuono_lib::ssr::Js::SSR.with(|ssr| ssr.borrow_mut().render_to_string(Some(&payload)))
                },
                /// TODO: handle here redirection and rewrite
                _ => Ok("500 Internal server error".to_string())
            };

            match res {
                Ok(html) => Html(html),
                _ => Html("500 internal server error".to_string())
            }
        }

        pub async fn api(request: axum::extract::Request) -> axum::response::Response {
            let pathname = &request.uri();
           let headers = &request.headers();

           let req = tuono_lib::Request::new(pathname, headers);

           let local_response = #fn_name(&req);

            let res = match local_response{
                tuono_lib::Response::Props(val) => return axum::Json(val).into_response(),
                _ => return axum::Json("").into_response()
            };
        }
    }
    .into()
}
