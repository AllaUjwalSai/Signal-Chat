from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(
        self,
        user_id: int,
        websocket: WebSocket,
    ):
        await websocket.accept()

        self.active_connections[user_id] = websocket

        # Tell the new user who is already online
        await self.send_online_users(user_id)

        # Notify everyone that this user is online
        await self.broadcast(
            {
                "type": "presence",
                "user_id": user_id,
                "online": True,
            }
        )

    async def disconnect(
        self,
        user_id: int,
    ):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

            await self.broadcast(
                {
                    "type": "presence",
                    "user_id": user_id,
                    "online": False,
                }
            )

    async def send_online_users(
        self,
        user_id: int,
    ):
        websocket = self.active_connections[user_id]

        for online_user in self.active_connections.keys():
            try:
                await websocket.send_json(
                    {
                        "type": "presence",
                        "user_id": online_user,
                        "online": True,
                    }
                )
            except Exception:
                pass

    async def broadcast(
        self,
        message: dict,
    ):
        disconnected = []

        for user_id, websocket in self.active_connections.items():
            try:
                await websocket.send_json(message)
            except Exception:
                disconnected.append(user_id)

        for user_id in disconnected:
            if user_id in self.active_connections:
                del self.active_connections[user_id]

    def is_online(
        self,
        user_id: int,
    ):
        return user_id in self.active_connections


manager = ConnectionManager()