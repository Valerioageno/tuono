use proc_macro::TokenStream;
use quote::quote;
use syn::punctuated::Punctuated;
use syn::token::Comma;
use syn::{parse2, parse_macro_input, FnArg, ItemFn, Pat, Type};

fn create_struct_fn_arg(arg_name: Pat, arg_type: Type) -> FnArg {
    parse2(quote! {
        tuono_lib::axum::extract::State(#arg_name): tuono_lib::axum::extract::State<#arg_type>
    })
    .unwrap()
}

fn params_argument() -> FnArg {
    parse2(quote! {
        tuono_lib::axum::extract::Path(params): tuono_lib::axum::extract::Path<
            std::collections::HashMap<String, String>
        >
    })
    .unwrap()
}

fn request_argument() -> FnArg {
    parse2(quote! {
            request: tuono_lib::axum::extract::Request
    })
    .unwrap()
}
pub fn handler_core(_args: TokenStream, item: TokenStream) -> TokenStream {
    let item = parse_macro_input!(item as ItemFn);

    let fn_name = &item.sig.ident;

    let mut argument_names: Punctuated<Pat, Comma> = Punctuated::new();
    let mut axum_arguments: Punctuated<FnArg, Comma> = Punctuated::new();

    // Fn Arguments minus the first which always is the request
    for (i, arg) in item.sig.inputs.iter().enumerate() {
        if i == 0 {
            axum_arguments.insert(i, params_argument());
            continue;
        }

        if let FnArg::Typed(pat_type) = arg {
            let index = i - 1;
            let argument_name = *pat_type.pat.clone();
            let argument_type = *pat_type.ty.clone();
            argument_names.insert(index, argument_name.clone());
            axum_arguments.insert(index, create_struct_fn_arg(argument_name, argument_type))
        }
    }

    axum_arguments.insert(axum_arguments.len(), request_argument());

    quote! {
        #item

        pub async fn route(
            #axum_arguments
        ) -> impl tuono_lib::axum::response::IntoResponse {
           let pathname = request.uri();
           let headers = request.headers();

           let req = tuono_lib::Request::new(pathname.to_owned(), headers.to_owned(), params);

           #fn_name(req.clone(), #argument_names).await.render_to_string(req)
        }

        pub async fn api(
            #axum_arguments
        ) -> impl tuono_lib::axum::response::IntoResponse {
           let pathname = request.uri();
           let headers = request.headers();

           let req = tuono_lib::Request::new(pathname.to_owned(), headers.to_owned(), params);

           #fn_name(req.clone(), #argument_names).await.json()
        }
    }
    .into()
}
