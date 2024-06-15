use clap::{Parser, Subcommand};
use std::process::Command;

mod source_builder;
use source_builder::{bundle_axum_source, create_client_entry_files};

use crate::source_builder::check_tuono_folder;
mod scaffold_project;
mod watch;

#[derive(Subcommand, Debug)]
enum Actions {
    /// Start the development environment
    Dev,
    /// Build the production assets
    Build,
    /// Scaffold a new project
    New {
        /// The folder in which load the project. Default is the current directory.
        folder_name: Option<String>,
        /// The template to use to scaffold the project. The template should match one of the tuono
        /// examples
        #[arg(short, long)]
        template: Option<String>,
    },
}

#[derive(Parser, Debug)]
#[command(version, about = "The react/rust fullstack framework")]
struct Args {
    #[command(subcommand)]
    action: Actions,
}

fn init_tuono_folder() -> std::io::Result<()> {
    check_tuono_folder()?;
    bundle_axum_source()?;
    create_client_entry_files()?;

    Ok(())
}

pub fn cli() -> std::io::Result<()> {
    let args = Args::parse();

    match args.action {
        Actions::Dev => {
            init_tuono_folder()?;
            watch::watch().unwrap();
        }
        Actions::Build => {
            init_tuono_folder()?;
            let mut vite_build = Command::new("./node_modules/.bin/tuono-build-prod");
            let _ = &vite_build.output()?;
        }
        Actions::New {
            folder_name,
            template,
        } => {
            scaffold_project::create_new_project(folder_name, template);
        }
    }

    Ok(())
}
