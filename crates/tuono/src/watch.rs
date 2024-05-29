use std::sync::Arc;
use watchexec_supervisor::command::{Command, Program};

use miette::{IntoDiagnostic, Result};
use watchexec::Watchexec;
use watchexec_signals::Signal;
use watchexec_supervisor::job::start_job;

use crate::source_builder::bundle_axum_source;

// What is the development pipeline?
//
// 1. Any file gets updates (rs/js/ts)
// 2. Client side vite works separately
// 3. Stop the dev server
// 4. Build the ssr client bundle
// 5. Restart the server
//
//
// The current solution is not optimized
// - We should avoid to bundle static lib (i.e. react) in the main bundle

#[tokio::main]
pub async fn watch() -> Result<()> {
    let (watch_client, _) = start_job(Arc::new(Command {
        program: Program::Exec {
            prog: "node_modules/.bin/tuono-dev-watch".into(),
            args: vec![],
        },
        options: Default::default(),
    }));

    watch_client.start().await;

    let (run_server, _) = start_job(Arc::new(Command {
        program: Program::Exec {
            prog: "cargo".into(),
            args: vec!["run".to_string()],
        },
        options: Default::default(),
    }));

    let (build_ssr_bundle, _) = start_job(Arc::new(Command {
        program: Program::Exec {
            prog: "node_modules/.bin/tuono-dev-ssr".into(),
            args: vec![],
        },
        options: Default::default(),
    }));

    build_ssr_bundle.start().await;
    run_server.start().await;

    let wx = Watchexec::new(move |mut action| {
        for event in action.events.iter() {
            for _ in event.paths() {
                run_server.stop();
                println!("Reloading server...");
                build_ssr_bundle.stop();
                build_ssr_bundle.start();
                bundle_axum_source();
                run_server.start();
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
