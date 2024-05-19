use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, ItemFn};

pub fn handler_core(_args: TokenStream, item: TokenStream) -> TokenStream {
    let item = parse_macro_input!(item as ItemFn);

    let fn_name = item.clone().sig.ident;

    quote! {
        use axum::response::Html;

        #item

        pub async fn route(request: axum::extract::Request) -> Html<String> {
           println!("Custom handler");
           let pathname = &request.uri();
           let headers = &request.headers();

           let req = tuono_lib::Request::new(pathname, headers);

           let props = #fn_name(&req);

            let payload = tuono_lib::Payload::new(&req, "".to_string()).client_payload();

            dbg!(&payload);

            let res = match props {
                tuono_lib::Response::Props(val) => tuono_lib::ssr::Js::SSR.with(|ssr| ssr.borrow_mut().render_to_string(Some(&payload))),
                _ => Ok("500 Internal server error".to_string())
            };

            match res {
                Ok(html) => Html(html),
                _ => Html("500 internal server error".to_string())
            }
            
        }
    }
    .into()
}
