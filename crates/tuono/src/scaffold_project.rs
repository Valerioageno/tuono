use clap::crate_version;
use reqwest::blocking;
use serde::Deserialize;
use std::env;
use std::fs::{self, create_dir, File, OpenOptions};
use std::io::{self, prelude::*};
use std::path::{Path, PathBuf};

const GITHUB_TUONO_REPO_URL: &str =
    "https://api.github.com/repos/tuono-labs/tuono/git/trees/main?recursive=1";

const GITHUB_RAW_CONTENT_URL: &str = "https://raw.githubusercontent.com/tuono-labs/tuono/main/";

#[derive(Deserialize, Debug)]
enum GithubFileType {
    #[serde(rename = "blob")]
    Blob,
    #[serde(rename = "tree")]
    Tree,
}

#[derive(Deserialize, Debug)]
struct GithubResponse<T> {
    tree: Vec<T>,
}

#[derive(Deserialize, Debug)]
struct GithubFile {
    path: String,
    #[serde(rename(deserialize = "type"))]
    element_type: GithubFileType,
}

fn create_file(path: PathBuf, content: String) -> std::io::Result<()> {
    let mut file = File::create(path)?;
    let _ = file.write_all(content.as_bytes());

    Ok(())
}

pub fn create_new_project(folder_name: Option<String>, template: Option<String>) {
    let folder = folder_name.unwrap_or(".".to_string());

    // In case of missing select the tuono example
    let template = template.unwrap_or("tuono-app".to_string());

    let client = blocking::Client::builder()
        .user_agent("")
        .build()
        .expect("Failed to build reqwest client");

    let res = client
        .get(GITHUB_TUONO_REPO_URL)
        .send()
        .expect("Failed to call the folder github API")
        .json::<GithubResponse<GithubFile>>()
        .expect("Failed to parse the repo structure");

    let new_project_files = res
        .tree
        .iter()
        .filter(|GithubFile { path, .. }| path.starts_with(&format!("examples/{template}/")))
        .collect::<Vec<&GithubFile>>();

    if new_project_files.is_empty() {
        eprintln!("Error: Template '{template}' not found");
        println!("Hint: you can view the available templates at https://github.com/tuono-labs/tuono/tree/main/examples");
        std::process::exit(1);
    }

    if folder != "." {
        if Path::new(&folder).exists() {
            eprintln!("Error: Directory '{folder}' already exists");
            println!("Hint: you can scaffold a tuono project within an existing folder with 'cd {folder} && tuono new .'");
            std::process::exit(1);
        }
        create_dir(&folder).unwrap();
    }

    let folder_name = PathBuf::from(&folder);
    let current_dir = env::current_dir().expect("Failed to get current working directory");

    let folder_path = current_dir.join(folder_name);

    create_directories(&new_project_files, &folder_path, &template)
        .expect("Failed to create directories");

    for GithubFile {
        element_type, path, ..
    } in new_project_files.iter()
    {
        if let GithubFileType::Blob = element_type {
            let file_content = client
                .get(format!("{GITHUB_RAW_CONTENT_URL}{path}"))
                .send()
                .expect("Failed to call the folder github API")
                .text()
                .expect("Failed to parse the repo structure");

            let path = PathBuf::from(&path.replace(&format!("examples/{template}/"), ""));

            let file_path = folder_path.join(&path);

            create_file(file_path, file_content).expect("failed to create file");
        }
    }

    update_package_json_version(&folder_path).expect("Failed to update package.json version");
    update_cargo_toml_version(&folder_path).expect("Failed to update Cargo.toml version");
    outro(folder);
}

fn create_directories(
    new_project_files: &[&GithubFile],
    folder_path: &Path,
    template: &String,
) -> io::Result<()> {
    for GithubFile {
        element_type, path, ..
    } in new_project_files.iter()
    {
        if let GithubFileType::Tree = element_type {
            let path = PathBuf::from(&path.replace(&format!("examples/{template}/"), ""));

            let dir_path = folder_path.join(&path);
            create_dir(&dir_path).unwrap();
        }
    }
    Ok(())
}

fn update_package_json_version(folder_path: &Path) -> io::Result<()> {
    let v = crate_version!();
    let package_json_path = folder_path.join(PathBuf::from("package.json"));
    let package_json = fs::read_to_string(&package_json_path)?;
    let package_json = package_json.replace("link:../../packages/tuono", v);

    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(package_json_path)?;

    file.write_all(package_json.as_bytes())?;

    Ok(())
}

fn update_cargo_toml_version(folder_path: &Path) -> io::Result<()> {
    let v = crate_version!();
    let cargo_toml_path = folder_path.join(PathBuf::from("Cargo.toml"));
    let cargo_toml = fs::read_to_string(&cargo_toml_path)?;
    let cargo_toml =
        cargo_toml.replace("{ path = \"../../crates/tuono_lib/\"}", &format!("\"{v}\""));

    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(cargo_toml_path)?;

    file.write_all(cargo_toml.as_bytes())?;

    Ok(())
}

fn outro(folder_name: String) {
    println!("Success! 🎉");

    if folder_name != "." {
        println!("\nGo to the project directory:");
        println!("cd {folder_name}/");
    }

    println!("\nInstall the dependencies:");
    println!("npm install");

    println!("\nRun the local environment:");
    println!("tuono dev");
}
