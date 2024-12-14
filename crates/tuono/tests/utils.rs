use fs_extra::dir::create_all;
use std::env;
use std::fs::File;
use std::io::Write;
use std::path::{Path, PathBuf};
use tempfile::{tempdir, TempDir};

#[derive(Debug)]
pub struct TempTuonoProject {
    original_dir: PathBuf,
    temp_dir: TempDir,
}

impl TempTuonoProject {
    pub fn new(is_api_only: bool) -> Self {
        let original_dir = env::current_dir().expect("Failed to read current_dir");
        let temp_dir = tempdir().expect("Failed to create temp_dir");

        env::set_current_dir(temp_dir.path()).expect("Failed to change current dir into temp_dir");

        let mut file = File::create(temp_dir.path().join("Cargo.toml"))
            .expect("Failed to create Cargo.toml file");
        if is_api_only {
            file.write_all(
                b"[dependencies]\ntuono_lib = { version = \"0.1.0\", features = [\"api\"] }",
            )
            .expect("Failed to write into Cargo.toml file");
        } else {
            file.write_all(b"[dependencies]\ntuono_lib = \"0.1.0\"")
                .expect("Failed to write into Cargo.toml file");
        }

        TempTuonoProject {
            original_dir,
            temp_dir,
        }
    }

    pub fn path(&self) -> &Path {
        self.temp_dir.path()
    }

    pub fn add_route<'a>(&self, path: &'a str) {
        let path = PathBuf::from(path);
        create_all(
            path.parent().expect("Route path does not have any parent"),
            false,
        )
        .expect("Failed to create parent route directory");
        File::create(path).expect("Failed to create the route file");
    }

    pub fn add_api<'a>(&self, path: &'a str, content: &'a str) {
        let path = PathBuf::from(path);
        create_all(
            path.parent().expect("Route path does not have any parent"),
            false,
        )
        .expect("Failed to create parent route directory");

        let mut file = File::create(path).expect("Failed to create the route file");
        file.write_all(content.as_bytes())
            .expect("Failed to write into API file");
    }
}

impl Drop for TempTuonoProject {
    fn drop(&mut self) {
        // Set back the current dir in the previous state
        env::set_current_dir(self.original_dir.to_owned())
            .expect("Failed to restore the original directory.");
    }
}
