use std::process::Command;
use std::fs;

use tempfile::tempdir;

const MAIN_RS_CONTENT: &str = "async fn main() {";
const INDEX_RS_CONTENT: &str = "async fn get_server_side_props(_req: Request) -> Response {";

// Tests the 'tuono build' command by confirming that main.rs is build and that it contains the start of main() function.
#[test]
fn test_tuono_build_success() {
    let temp_dir = tempdir().expect("Failed to create a temporary test directory.");
    let temp_path = temp_dir.path();

    // Can be used on a later date to check if the tuono build was complete without any errors
    let _status = Command::new("tuono")
        .arg("build")
        .current_dir(&temp_path)
        .status()
        .expect("Failed to execute 'tuono build'.");

    let temp_main_rs_path = temp_path.join(".tuono/main.rs");
    assert!(
        temp_main_rs_path.exists(),
        "'.tuono/main.rs' was not created successfully."
    );

    let temp_main_rs_content = fs::read_to_string(&temp_main_rs_path)
        .expect("Failed to read '.tuono/main.rs' content.");

    assert!(
        temp_main_rs_content.contains(MAIN_RS_CONTENT),
        "'.tuono/main.rs' doesn't contain the expected code."
    );
}

// Tests the 'tuono new' command by confirming that index.rs is build and that it contains the start of its function.
#[test]
fn test_tuono_new_success() {
    let temp_dir = tempdir().expect("Failed to create a temporary test directory.");
    let temp_path = temp_dir.path();

    let _status = Command::new("tuono")
        .arg("new")
        .arg("test_tuono")
        .current_dir(&temp_path)
        .status()
        .expect("Failed to execute 'tuono build'.");

    let temp_index_path = temp_path.join("test_tuono/src/routes/index.rs");
    assert!(
        temp_index_path.exists(),
        "'test_tuono/src/routes/index.rs' was not created successfully."
    );

    let temp_index_content = fs::read_to_string(&temp_index_path)
        .expect("Failed to read 'test_tuono/src/routes/index.rs'.");
    assert!(
        temp_index_content.contains(INDEX_RS_CONTENT),
        "'test_tuono/src/routes/index.rs' doesn't contain the expected code."
    );
}