use clap::{Parser, Subcommand};
use std::process::Command;
mod axum_source_builder;
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
        Actions::Dev => watch::watch().unwrap(),
        Actions::Build => {
            axum_source_builder::bundle_axum_source();

            println!("Build JS source");
            let mut vite_build = Command::new("./node_modules/.bin/tuono-build-prod");
            let _ = &vite_build.output().unwrap();
        }
        Actions::New => {
            println!("Scaffold new project")
        }
    }
}
