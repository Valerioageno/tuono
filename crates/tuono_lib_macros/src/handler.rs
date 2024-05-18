use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, ItemFn};

pub fn handler_core(_args: TokenStream, item: TokenStream) -> TokenStream {
    let item = parse_macro_input!(item as ItemFn);

    let fn_name = item.clone().sig.ident;

    quote! {
        use tuono_lib::Response;
        use axum::response::Html;
        use axum::http::Uri;
        use tuono_lib::ssr;

        #item

        pub async fn route(uri: Uri) -> Html<String> {
            println!("Custom handler");
           let props = #fn_name();

            let res = match props {
                Response::Props(val) => ssr::Js::SSR.with(|ssr| ssr.borrow_mut().render_to_string(Some(val.as_str()))),
                _ => Ok("500 Internal server error".to_string())
            };

            match res {
                Ok(html) => Html(html),
                _ => Html("500".to_string())
            }
            
        }
    }
    .into()
}
