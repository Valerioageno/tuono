use std::path::Path;
use std::process::{Command, Stdio};

fn spawn_vite_process() -> std::io::Result<()> {
    println!("Spawing vite process");
    let current_dir = std::env::current_dir()?;

    let vite_path = Path::new("node_modules/.bin/vite");
    let vite = current_dir.join(vite_path);

    dbg!(&vite);

    let _ = Command::new(vite)
        .arg("dev")
        .stdout(Stdio::inherit())
        .output()?;

    Ok(())
}

pub fn run() {
    println!("Running dev environment");
    let _ = spawn_vite_process();
}
