use proc_macro::TokenStream;
use quote::quote;
use syn::punctuated::Punctuated;
use syn::token::Comma;
use syn::{parse2, parse_macro_input, parse_quote, FnArg, ItemFn, Pat, Stmt};

fn create_struct_fn_arg() -> FnArg {
    parse2(quote! {
        tuono_lib::axum::extract::State(state): tuono_lib::axum::extract::State<ApplicationState>
    })
    .unwrap()
}

fn import_main_application_state(argument_names: Punctuated<Pat, Comma>) -> Option<Stmt> {
    if !argument_names.is_empty() {
        let local: Stmt = parse_quote!(
            use crate::tuono_main_state::ApplicationState;
        );
        return Some(local);
    }

    None
}

fn crate_application_state_extractor(argument_names: Punctuated<Pat, Comma>) -> Option<Stmt> {
    if !argument_names.is_empty() {
        let use_item: Stmt = parse_quote!(let ApplicationState { #argument_names } = state;);
        return Some(use_item);
    }

    None
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
pub fn api_core(_args: TokenStream, item: TokenStream) -> TokenStream {
    let item = parse_macro_input!(item as ItemFn);

    let fn_name = &item.sig.ident;
    let return_type = &item.sig.output;

    let mut argument_names: Punctuated<Pat, Comma> = Punctuated::new();
    let mut axum_arguments: Punctuated<FnArg, Comma> = Punctuated::new();

    // Fn Arguments minus the first which always is the request
    for (i, arg) in item.sig.inputs.iter().enumerate() {
        if i == 0 {
            axum_arguments.insert(i, params_argument());
            continue;
        }

        if i == 1 {
            axum_arguments.insert(1, create_struct_fn_arg())
        }

        if let FnArg::Typed(pat_type) = arg {
            let index = i - 1;
            let argument_name = *pat_type.pat.clone();
            argument_names.insert(index, argument_name.clone());
        }
    }

    axum_arguments.insert(axum_arguments.len(), request_argument());

    let application_state_extractor = crate_application_state_extractor(argument_names.clone());
    let application_state_import = import_main_application_state(argument_names.clone());

    quote! {
        #application_state_import

        #item

        pub async fn route(#axum_arguments)#return_type {

            #application_state_extractor

           let pathname = request.uri();
           let headers = request.headers();

           let req = tuono_lib::Request::new(pathname.to_owned(), headers.to_owned(), params);

           #fn_name(req.clone(), #argument_names).await
        }
    }
    .into()
}
