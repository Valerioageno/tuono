use once_cell::sync::OnceCell;
use serde::Deserialize;
use std::collections::HashMap;
use std::fs::File;
use std::io::BufReader;
use std::path::PathBuf;

const VITE_MANIFEST_PATH: &str = "./out/client/.vite/manifest.json";

#[derive(Deserialize, Debug)]
pub struct BundleInfo {
    pub file: String,
    pub css: Vec<String>,
}

/// Manifest is the mapping between the vite output bundled files
/// and the originals.
/// Vite doc: https://vitejs.dev/config/build-options.html#build-manifest
pub static MANIFEST: OnceCell<HashMap<String, BundleInfo>> = OnceCell::new();

pub fn load_manifest() {
    let file = File::open(PathBuf::from(VITE_MANIFEST_PATH)).unwrap();
    let reader = BufReader::new(file);
    let manifest = serde_json::from_reader(reader).unwrap();
    MANIFEST.set(manifest).unwrap();
}
