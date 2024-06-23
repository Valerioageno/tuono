use once_cell::sync::OnceCell;
use serde::Deserialize;
use std::collections::HashMap;
use std::fs::File;
use std::io::BufReader;
use std::path::PathBuf;

const VITE_MANIFEST_PATH: &str = "./out/client/.vite/manifest.json";

#[derive(Deserialize, Debug, Clone)]
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
    MANIFEST.set(remap_manifest_keys(manifest)).unwrap();
}

fn remap_manifest_keys(manifest: HashMap<String, BundleInfo>) -> HashMap<String, BundleInfo> {
    let mut new_hashmap = HashMap::new();

    manifest.keys().for_each(|key| {
        let new_key = key
            .replace("../src/routes", "")
            .replace(".tsx", "")
            .replace(".jsx", "")
            .replace("index", "");

        new_hashmap.insert(new_key, manifest.get(key).unwrap().clone());
    });

    new_hashmap
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn should_correctly_remap_the_manifest() {
        let mut parsed_manifest: HashMap<String, BundleInfo> = HashMap::new();
        parsed_manifest.insert(
            "../src/routes/index.tsx".to_string(),
            BundleInfo {
                file: "assets/index.js".to_string(),
                css: vec!["assets/index.css".to_string()],
            },
        );
        parsed_manifest.insert(
            "../src/routes/about.jsx".to_string(),
            BundleInfo {
                file: "assets/about.js".to_string(),
                css: vec!["assets/about.css".to_string()],
            },
        );
        parsed_manifest.insert(
            "../src/routes/posts/[post].tsx".to_string(),
            BundleInfo {
                file: "assets/posts/[post].js".to_string(),
                css: vec!["assets/posts/[post].css".to_string()],
            },
        );
        parsed_manifest.insert(
            "client-main.tsx".to_string(),
            BundleInfo {
                file: "assets/main.js".to_string(),
                css: vec!["assets/main.css".to_string()],
            },
        );

        let remapped = remap_manifest_keys(parsed_manifest);

        assert_eq!(
            remapped.get("/").unwrap().file,
            "assets/index.js".to_string()
        );
        assert_eq!(
            remapped.get("/about").unwrap().file,
            "assets/about.js".to_string()
        );
        assert_eq!(
            remapped.get("/posts/[post]").unwrap().file,
            "assets/posts/[post].js".to_string()
        );
        assert_eq!(
            remapped.get("client-main").unwrap().file,
            "assets/main.js".to_string()
        );
    }
}
