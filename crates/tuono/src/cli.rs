use clap::{Parser, Subcommand};
use std::process::Command;

use crate::app::App;
use crate::mode::Mode;
use crate::scaffold_project;
use crate::source_builder::{bundle_axum_source, check_tuono_folder, create_client_entry_files};
use crate::watch;

#[derive(Subcommand, Debug)]
enum Actions {
    /// Start the development environment
    Dev,
    /// Build the production assets
    Build {
        #[arg(short, long = "static")]
        /// Statically generate the website HTML
        ssg: bool,
    },
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

fn init_tuono_folder(mode: Mode) -> std::io::Result<()> {
    check_tuono_folder()?;
    bundle_axum_source(mode)?;
    create_client_entry_files()?;

    Ok(())
}

pub fn app() -> std::io::Result<()> {
    let args = Args::parse();

    match args.action {
        Actions::Dev => {
            init_tuono_folder(Mode::Dev)?;
            watch::watch().unwrap();
        }
        Actions::Build { ssg } => {
            init_tuono_folder(Mode::Prod)?;
            let mut vite_build = Command::new("./node_modules/.bin/tuono-build-prod");
            let _ = &vite_build.output()?;

            if ssg {
                println!("SSG: generation started");
                let app = App::new();
                dbg!(app);
            }
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
