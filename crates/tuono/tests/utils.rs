use tempfile::{tempdir, TempDir};

pub fn create_temp_tuono_folder() -> TempDir {
    tempdir().expect("Failed to create a temporary test directory.")
}
