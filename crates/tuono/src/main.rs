use tuono::cli::app;

#[tokio::main]
async fn main() {
    app().await.expect("Failed to start the CLI")
}
