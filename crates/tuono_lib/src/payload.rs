use crate::{manifest::MANIFEST, Mode, GLOBAL_MODE};
use erased_serde::Serialize;
use serde::Serialize as SerdeSerialize;

use crate::request::Location;
use crate::Request;

#[derive(SerdeSerialize)]
/// This is the payload sent to the client for hydration
pub struct Payload<'a> {
    router: Location,
    props: &'a dyn Serialize,
    mode: Mode,
    #[serde(rename(serialize = "jsBundles"))]
    js_bundles: Option<Vec<&'a String>>,
    #[serde(rename(serialize = "cssBundles"))]
    css_bundles: Option<&'a Vec<String>>,
}

impl<'a> Payload<'a> {
    pub fn new(req: &Request<'a>, props: &'a dyn Serialize) -> Payload<'a> {
        Payload {
            router: req.location(),
            props,
            mode: *GLOBAL_MODE.get().expect("Failed to load the current mode"),
            js_bundles: None,
            css_bundles: None,
        }
    }

    pub fn client_payload(&mut self) -> Result<String, serde_json::Error> {
        if self.mode == Mode::Prod {
            self.add_bundle_sources();
        }
        serde_json::to_string(&self)
    }

    fn add_bundle_sources(&mut self) {
        // Manifest should always be loaded. The load happen before starting
        // the server.
        let manifest = MANIFEST.get().expect("Failed to load manifest");

        // The main bundle should always exist.
        // The extension should be tsx even with JS only projects.
        let main_bundle = manifest
            .get("client-main.tsx")
            .expect("Failed to get client-main.tsx");

        self.js_bundles = Some(vec![&main_bundle.file]);
        self.css_bundles = Some(&main_bundle.css);
    }
}

#[cfg(test)]
mod tests {

    use super::*;
    use axum::http::Uri;
    use std::collections::HashMap;

    use crate::manifest::BundleInfo;

    fn prepare_payload(mode: Mode) -> Payload<'static> {
        let mut manifest_mock = HashMap::new();
        manifest_mock.insert(
            "client-main.tsx".to_string(),
            BundleInfo {
                file: "assets/bundled-file.js".to_string(),
                css: vec!["assets/bundled-file.css".to_string()],
            },
        );
        MANIFEST.get_or_init(|| manifest_mock);
        let location = Location::from(&"http://localhost:3000".parse::<Uri>().unwrap());

        Payload {
            router: location,
            props: &None::<Option<()>>,
            mode,
            js_bundles: None,
            css_bundles: None,
        }
    }

    #[test]
    fn should_load_the_bundles_on_mode_prod() {
        let mut payload = prepare_payload(Mode::Prod);

        let _ = payload.client_payload();
        assert_eq!(
            payload.js_bundles,
            Some(vec![&"assets/bundled-file.js".to_string()])
        );
        assert_eq!(
            payload.css_bundles,
            Some(&vec!["assets/bundled-file.css".to_string()])
        );
    }

    #[test]
    fn should_not_load_the_bundles_on_mode_dev() {
        let mut payload = prepare_payload(Mode::Dev);
        let _ = payload.client_payload();
        assert!(payload.js_bundles.is_none());
        assert!(payload.css_bundles.is_none());
    }
}
