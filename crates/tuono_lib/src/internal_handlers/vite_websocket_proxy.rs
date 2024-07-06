use axum::extract::ws::{WebSocket, WebSocketUpgrade};

use axum::response::Response;

const VITE_URL: &str = "http://localhost:3001/vite-server";

pub async fn vite_websocket_proxy(ws: WebSocketUpgrade) -> Response {
    ws.on_upgrade(handle_socket)
}

async fn handle_socket(mut socket: WebSocket) {
    while let Some(msg) = socket.recv().await {
        let msg = if let Ok(msg) = msg {
            msg
        } else {
            // client disconnected
            return;
        };

        if socket.send(msg).await.is_err() {
            println!("Disconnected");
            // client disconnected
            return;
        }
    }
}
