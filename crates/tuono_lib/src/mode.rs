use once_cell::sync::OnceCell;

#[derive(Debug, PartialEq, Eq)]
pub enum Mode {
    Dev,
    Prod,
}

pub static GLOBAL_MODE: OnceCell<Mode> = OnceCell::new();
