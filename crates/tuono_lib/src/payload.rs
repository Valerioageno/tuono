use serde::Serialize;

use crate::request::Location;
use crate::Request;

#[derive(Serialize)]
/// This is the data shared to the client
pub struct Payload<'a> {
    router: Location<'a>,
    props: String,
}

impl<'a> Payload<'a> {
    pub fn new(req: &Request<'a>, props: String) -> Payload<'a> {
        Payload {
            router: req.location(),
            props,
        }
    }

    pub fn client_payload(&self) -> String {
        serde_json::to_string(&self).unwrap()
    }
}
