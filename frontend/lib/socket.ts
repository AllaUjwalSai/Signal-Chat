let socket: WebSocket | null = null;

export function connectSocket(
  userId: number
) {
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING)
  ) {
    return socket;
  }

  const wsBase =
    process.env.NEXT_PUBLIC_WS_URL ??
    "ws://127.0.0.1:8000";

  socket = new WebSocket(
    `${wsBase}/ws/${userId}`
  );

  socket.onopen = () => {
    console.log("✅ WebSocket Connected");
  };

  socket.onclose = () => {
    console.log("❌ WebSocket Closed");
    socket = null;
  };

  socket.onerror = (err) => {
    console.error("WebSocket Error:", err);
  };

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  socket?.close();
  socket = null;
}