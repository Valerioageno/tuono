use fs_extra::dir::create_all;
use std::env;
use std::fs::File;
use std::path::{Path, PathBuf};
use tempfile::{tempdir, TempDir};

#[derive(Debug)]
pub struct TempTuonoProject {
    original_dir: PathBuf,
    temp_dir: TempDir,
}

impl TempTuonoProject {
    pub fn new() -> Self {
        let original_dir = env::current_dir().expect("Failed to read current_dir");
        let temp_dir = tempdir().expect("Failed to create temp_dir");

        env::set_current_dir(temp_dir.path()).expect("Failed to change current dir into temp_dir");

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
}

impl Drop for TempTuonoProject {
    fn drop(&mut self) {
        // Set back the current dir in the previous state
        env::set_current_dir(self.original_dir.to_owned())
            .expect("Failed to restore the original directory.");
    }
}
