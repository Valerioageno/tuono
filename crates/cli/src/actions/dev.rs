use bundler::bundler;
pub fn run() {
    bundler::watch().unwrap();
}
