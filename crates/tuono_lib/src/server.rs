use crate::mode::{Mode, GLOBAL_MODE};

use axum::routing::Router;

pub struct Server {
    router: Router,
}

impl Server {
    pub fn init(router: Router) -> Server {
        Server { router }
    }

    pub async fn start(&self) {
        let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

        if *GLOBAL_MODE.get().unwrap() == Mode::Dev {
            println!("\nDevelopment app ready at http://localhost:3000/");
        } else {
            println!("\nProduction app ready at http://localhost:3000/");
        }

        axum::serve(listener, self.router.to_owned()).await.unwrap();
    }
}
