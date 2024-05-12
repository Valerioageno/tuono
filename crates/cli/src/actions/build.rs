fn is_valid_project_folder(_directory: &String) -> bool {
    true
}

pub fn run(directory: String) {
    if !is_valid_project_folder(&directory) {
        println!("It does not seem to be a valid project folder");
        return;
    }

    todo!()
}
