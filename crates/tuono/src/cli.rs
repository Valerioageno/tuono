use fs_extra::dir::{copy, CopyOptions};
use std::path::PathBuf;
use std::thread::sleep;
use std::time::Duration;

use clap::{Parser, Subcommand};

use crate::app::App;
use crate::mode::Mode;
use crate::scaffold_project;
use crate::source_builder::{bundle_axum_source, check_tuono_folder, create_client_entry_files};
use crate::watch;

const TUONO_PORT: u16 = 3000;
const VITE_PORT: u16 = 3001;

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
#[command(version, about = "The React/Rust full-stack framework")]
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

fn check_ports(mode: Mode) {
    let rust_listener = std::net::TcpListener::bind(format!("0.0.0.0:{TUONO_PORT}"));

    if let Err(_e) = rust_listener {
        eprintln!("Error: Failed to bind to port {}", TUONO_PORT);
        eprintln!(
            "Please ensure that port {} is not already in use by another process or application.",
            TUONO_PORT
        );
        std::process::exit(1);
    }

    if mode == Mode::Dev {
        let vite_listener = std::net::TcpListener::bind(format!("0.0.0.0:{VITE_PORT}"));

        if let Err(_e) = vite_listener {
            eprintln!("Error: Failed to bind to port {}", VITE_PORT);
            eprintln!(
                "Please ensure that port {} is not already in use by another process or application.",
                VITE_PORT
            );
            std::process::exit(1);
        }
    }
}

pub fn app() -> std::io::Result<()> {
    let args = Args::parse();

    match args.action {
        Actions::Dev => {
            check_ports(Mode::Dev);

            init_tuono_folder(Mode::Dev)?;

            watch::watch().unwrap();
        }
        Actions::Build { ssg } => {
            init_tuono_folder(Mode::Prod)?;
            let app = App::new();

            if ssg && app.has_dynamic_routes() {
                // TODO: allow dynamic routes static generation
                println!("Cannot statically build dynamic routes");
                return Ok(());
            }

            app.build_react_prod();

            if ssg {
                check_ports(Mode::Prod);

                println!("SSG: generation started");

                let static_dir = PathBuf::from("out/static");

                if static_dir.is_dir() {
                    std::fs::remove_dir_all(&static_dir)
                        .expect("Failed to clear the out/static folder");
                }

                std::fs::create_dir(&static_dir).expect("Failed to create static output dir");

                copy(
                    "./out/client",
                    static_dir,
                    &CopyOptions::new().overwrite(true).content_only(true),
                )
                .expect("Failed to clone assets into static output folder");

                let mut rust_server = app.run_rust_server();

                let reqwest = reqwest::blocking::Client::builder()
                    .user_agent("")
                    .build()
                    .expect("Failed to build reqwest client");

                // Wait for server
                let mut is_server_ready = false;

                while !is_server_ready {
                    if reqwest.get("http://localhost:3000").send().is_ok() {
                        is_server_ready = true
                    }
                    // TODO: add maximum tries
                    sleep(Duration::from_secs(1))
                }

                for (_, route) in app.route_map {
                    route.save_ssg_file(&reqwest)
                }

                // Close server
                let _ = rust_server.kill();
            };

            println!("Build successfully finished");
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
