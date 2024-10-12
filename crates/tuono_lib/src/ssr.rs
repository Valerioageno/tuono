use crate::mode::{Mode, GLOBAL_MODE};
use ssr_rs::{Ssr, SsrError};
use std::cell::RefCell;
use std::fs::read_to_string;
use std::path::PathBuf;

/// For the server side rendering we need to split the implementation between dev and prod.
/// This completely remove the multi-thread optimization on dev but allow the dev server to
/// update the SSR result without reloading the whole server.
pub struct Js;

impl Js {
    pub fn render_to_string(payload: Option<&str>) -> Result<String, SsrError> {
        let mode = GLOBAL_MODE.get().expect("Failed to get GLOBAL_MODE");

        if *mode == Mode::Dev {
            DevJs::render_to_string(payload)
        } else {
            ProdJs::SSR.with(|ssr| ssr.borrow_mut().render_to_string(payload))
        }
    }
}

struct ProdJs;

impl ProdJs {
    thread_local! {
        pub static SSR: RefCell<Ssr<'static, 'static>> = RefCell::new(
                Ssr::from(
                    read_to_string(PathBuf::from("./out/server/prod-server.js")).expect("Server bundle not found"), ""
                    ).unwrap()
                )
    }
}

struct DevJs;

impl DevJs {
    pub fn render_to_string(params: Option<&str>) -> Result<String, SsrError> {
        Ssr::from(
            read_to_string(PathBuf::from("./.tuono/server/dev-server.js"))
                .expect("Server bundle not found"),
            "",
        )
        .unwrap()
        .render_to_string(params)
    }
}
