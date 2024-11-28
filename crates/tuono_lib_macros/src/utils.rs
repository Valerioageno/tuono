use quote::quote;
use syn::punctuated::Punctuated;
use syn::token::Comma;
use syn::{parse2, parse_quote, FnArg, Pat, Stmt};

pub fn create_struct_fn_arg() -> FnArg {
    parse2(quote! {
        tuono_lib::axum::extract::State(state): tuono_lib::axum::extract::State<ApplicationState>
    })
    .unwrap()
}

pub fn import_main_application_state(argument_names: Punctuated<Pat, Comma>) -> Option<Stmt> {
    if !argument_names.is_empty() {
        let local: Stmt = parse_quote!(
            use crate::tuono_main_state::ApplicationState;
        );
        return Some(local);
    }

    None
}

pub fn crate_application_state_extractor(argument_names: Punctuated<Pat, Comma>) -> Option<Stmt> {
    if !argument_names.is_empty() {
        let use_item: Stmt = parse_quote!(let ApplicationState { #argument_names, .. } = state;);
        return Some(use_item);
    }

    None
}

pub fn params_argument() -> FnArg {
    parse2(quote! {
        tuono_lib::axum::extract::Path(params): tuono_lib::axum::extract::Path<
            std::collections::HashMap<String, String>
        >
    })
    .unwrap()
}

pub fn request_argument() -> FnArg {
    parse2(quote! {
            request: tuono_lib::axum::extract::Request
    })
    .unwrap()
}
