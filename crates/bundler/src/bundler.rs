use std::sync::Arc;
use watchexec_supervisor::command::{Command, Program};

use axum_bundler::bundle_axum_source;
use miette::{IntoDiagnostic, Result};
use watchexec::Watchexec;
use watchexec_signals::Signal;
use watchexec_supervisor::job::start_job;

#[tokio::main]
pub async fn watch() -> Result<()> {
    bundle_axum_source();

    let (run_server, _) = start_job(Arc::new(Command {
        program: Program::Exec {
            prog: "cargo".into(),
            args: vec!["run".to_string()],
        }
        .into(),
        options: Default::default(),
    }));

    let (build_server_js, _) = start_job(Arc::new(Command {
        program: Program::Exec {
            prog: "node_modules/.bin/vite".into(),
            // TODO: update output directory: Use .tuono
            args: vec![
                "build".to_string(),
                "--ssr".to_string(),
                "--logLevel".to_string(),
                "silent".to_string(),
            ],
        }
        .into(),
        options: Default::default(),
    }));

    build_server_js.start().await;
    run_server.start().await;

    let wx = Watchexec::new(move |mut action| {
        for event in action.events.iter() {
            for path in event.paths() {
                if path.0.to_string_lossy().ends_with(".rs") {
                    run_server.stop();
                    println!("Reloading server...");
                    build_server_js.stop();
                    build_server_js.start();
                    bundle_axum_source();
                    run_server.start();
                }
            }
        }

        // if Ctrl-C is received, quit
        if action.signals().any(|sig| sig == Signal::Interrupt) {
            action.quit();
        }

        action
    })?;

    // watch the current directory
    wx.config.pathset(["./src"]);

    let _ = wx.main().await.into_diagnostic()?;
    Ok(())
}
