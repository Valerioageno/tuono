use clap::{Parser, Subcommand};
pub mod actions;

#[derive(Subcommand, Debug)]
enum Actions {
    /// Start the development environment
    Dev,
    /// Build the production assets
    Build {
        #[arg(short, long, default_value_t = String::from("."))]
        directory: String,
    },
    /// Create a new project folder
    New {
        #[arg(short, long, default_value_t = String::from("."))]
        _directory: String,
    },
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
        Actions::Dev => actions::dev::run(),
        Actions::Build { directory } => actions::build::run(directory),
        Actions::New { _directory } => actions::new::run(),
    }
}
