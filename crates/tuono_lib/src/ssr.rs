use ssr_rs::Ssr;
use std::cell::RefCell;
use std::fs::read_to_string;

pub struct Js;

impl Js {
    thread_local! {
        pub static SSR: RefCell<Ssr<'static, 'static>> = RefCell::new(
              // TODO: handle here dev/prod source
                Ssr::from(
                    read_to_string("./.tuono/server/dev-server.js").unwrap(),
                    ""
                    ).unwrap()
                )
    }
}
