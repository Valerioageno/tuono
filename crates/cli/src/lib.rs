use clap::{Parser, Subcommand};
pub mod actions;
use actions::{build, dev, new};

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
        Actions::Dev => dev::run(),
        Actions::Build => build::run(),
        Actions::New => new::run(),
    }
}
