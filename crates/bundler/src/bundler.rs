use std::sync::Arc;
use watchexec_supervisor::command::{Command, Program};

use axum_bundler::bundle;
use miette::{IntoDiagnostic, Result};
use watchexec::Watchexec;
use watchexec_signals::Signal;
use watchexec_supervisor::job::start_job;

#[tokio::main]
pub async fn watch() -> Result<()> {
    bundle();
    let (job, _) = start_job(Arc::new(Command {
        program: Program::Exec {
            prog: "cargo".into(),
            args: vec!["run".to_string()],
        }
        .into(),
        options: Default::default(),
    }));

    job.start().await;

    let wx = Watchexec::new(move |mut action| {
        for event in action.events.iter() {
            for path in event.paths() {
                if path.0.to_string_lossy().ends_with(".rs") {
                    job.stop();
                    println!("Reloading server...");
                    bundle();
                    job.start();
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
