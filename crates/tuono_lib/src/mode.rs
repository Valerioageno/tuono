use once_cell::sync::OnceCell;
use serde::Serialize;

#[derive(Debug, PartialEq, Eq, Serialize, Clone, Copy)]
pub enum Mode {
    Dev,
    Prod,
}

pub static GLOBAL_MODE: OnceCell<Mode> = OnceCell::new();
