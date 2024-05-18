use bundler::bundler;
use std::path::Path;
use std::process::Command;
use std::thread;

pub fn run() {
    let current_dir = std::env::current_dir().unwrap();

    let vite_path = Path::new("node_modules/.bin/vite");
    let vite = current_dir.join(vite_path);

    let vite_handler = thread::spawn(move || {
        println!("Spawing vite process");
        let _ = Command::new(vite).arg("dev").output();
    });

    let build_rs_handler = thread::spawn(move || {
        bundler::watch().unwrap();
    });

    let _ = vite_handler.join();
    let _ = build_rs_handler.join();
}
