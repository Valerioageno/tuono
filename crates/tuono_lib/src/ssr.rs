use crate::{Mode, GLOBAL_MODE};
use lazy_static::lazy_static;
use ssr_rs::Ssr;
use std::cell::RefCell;
use std::fs::read_to_string;
use std::path::PathBuf;

lazy_static! {
    static ref BUNDLE_PATH: &'static str = {
        if GLOBAL_MODE.get().unwrap() == &Mode::Dev {
            return "./.tuono/server/dev-server.js";
        }
        "./out/server/prod-server.js"
    };
}

pub struct Js;

impl Js {
    thread_local! {
        pub static SSR: RefCell<Ssr<'static, 'static>> = RefCell::new(
                Ssr::from(
                    read_to_string(PathBuf::from(*BUNDLE_PATH)).expect("Server bundle not found"), ""
                    ).unwrap()
                )
    }
}
