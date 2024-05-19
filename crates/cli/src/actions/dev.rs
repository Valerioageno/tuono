use bundler::bundler;
use std::path::Path;
use std::process::Command;
use std::thread;

pub fn run() {
    let current_dir = std::env::current_dir().unwrap();

    let vite_path = Path::new("node_modules/.bin/vite");
    let vite = current_dir.join(vite_path);

    let client_handler = thread::spawn(move || {
        let _ = Command::new(vite).arg("dev").output();
    });

    let server_handler = thread::spawn(move || {
        bundler::watch().unwrap();
    });

    let _ = client_handler.join();
    let _ = server_handler.join();
}
