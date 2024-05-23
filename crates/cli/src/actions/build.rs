use axum_bundler::bundle_axum_source;
use std::process::Command;

pub fn run() {
    // TODO: Pass "build" argument to update SSR path
    bundle_axum_source();

    println!("Build JS source");
    let mut vite_build = Command::new("./node_modules/.bin/tuono-build-prod");
    let _ = &vite_build.output().unwrap();
}
