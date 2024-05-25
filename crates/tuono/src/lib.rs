use clap::{Parser, Subcommand};
use std::process::Command;

mod source_builder;
use source_builder::{bundle_axum_source, create_client_entry_files};
mod watch;

#[derive(Subcommand, Debug)]
enum Actions {
    /// Start the development environment
    Dev,
    /// Build the production assets
    Build,
    /// Create a new project folder
    New,
}

#[derive(Parser, Debug)]
#[command(version, about = "The react/rust fullstack framework")]
struct Args {
    #[command(subcommand)]
    action: Option<Actions>,
}

pub fn cli() {
    let args = Args::parse();

    match args.action.unwrap() {
        Actions::Dev => {
            bundle_axum_source();
            create_client_entry_files().unwrap();
            watch::watch().unwrap();
        }
        Actions::Build => {
            bundle_axum_source();
            create_client_entry_files().unwrap();
            let mut vite_build = Command::new("./node_modules/.bin/tuono-build-prod");
            let _ = &vite_build.output().unwrap();
        }
        Actions::New => {
            println!("Scaffold new project")
        }
    }
}
