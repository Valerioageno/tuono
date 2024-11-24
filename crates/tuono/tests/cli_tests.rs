use trycmd;

#[test]
fn test_tuono_help_success() {
    trycmd::TestCases::new()
    .case("tests/cmd/tuono_help_success.trycmd");
}

// TODO: Fix the test case
// #[test]
// fn test_tuono_build_success() {
//     trycmd::TestCases::new()
//     .case("tests/cmd/tuono_build_success.trycmd");
// }