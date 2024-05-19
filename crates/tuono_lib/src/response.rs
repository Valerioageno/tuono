use erased_serde::Serialize;

pub enum Response {
    Redirect(String),
    Props(Box<dyn Serialize>),
}
