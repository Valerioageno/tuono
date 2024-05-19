use erased_serde::Serialize;
use serde::Serialize as SerdeSerialize;

use crate::request::Location;
use crate::Request;

#[derive(SerdeSerialize)]
/// This is the data shared to the client
pub struct Payload<'a> {
    router: Location<'a>,
    props: Box<dyn Serialize>,
}

impl<'a> Payload<'a> {
    pub fn new(req: &Request<'a>, props: Box<dyn Serialize>) -> Payload<'a> {
        Payload {
            router: req.location(),
            props,
        }
    }

    pub fn client_payload(&self) -> Result<String, serde_json::Error> {
        serde_json::to_string(&self)
    }
}
