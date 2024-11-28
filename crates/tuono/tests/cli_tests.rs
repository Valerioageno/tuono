use std::env;
use std::fs;
mod utils;
use assert_cmd::Command;
use utils::create_temp_tuono_folder;

const MAIN_RS_CONTENT: &str = "async fn main() {";

// Tests the 'tuono build' command by confirming that main.rs is build and that it contains the start of main() function.
#[test]
fn test_tuono_build_success() {
    let temp_dir = create_temp_tuono_folder();
    let temp_path = temp_dir.path();

    let original_dir = env::current_dir().expect("Failed to get the current directory.");
    env::set_current_dir(&temp_path).expect("Failed to change the current directory.");

    let test_result = std::panic::catch_unwind(|| {
        let mut test_tuono_build = Command::cargo_bin("tuono").unwrap();
        test_tuono_build.arg("build").arg("—no-js-emit").assert().success();

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
    });

    env::set_current_dir(original_dir).expect("Failed to restore the original directory.");

    test_result.unwrap()
}
