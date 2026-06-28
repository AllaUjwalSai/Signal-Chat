from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine

from app.seed import seed_database

# Models
from app.models.user import User
from app.models.conversation import Conversation
from app.models.conversation_member import ConversationMember
from app.models.message import Message

# Routers
from app.routes.user import router as user_router
from app.routes.auth import router as auth_router
from app.routes.chat import router as chat_router
from app.routes.message import router as message_router
from app.routes.read_receipt import router as read_router

# WebSocket
from app.websocket import manager

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Signal Clone API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.websocket("/ws/{user_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: int,
):
    await manager.connect(
        user_id,
        websocket,
    )

    try:
        while True:
            data = await websocket.receive_json()

            await manager.broadcast(data)

    except Exception:
        await manager.disconnect(user_id)


# Register routers
app.include_router(user_router)
app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(message_router)
app.include_router(read_router)


@app.get("/")
def root():
    return {
        "message": "🚀 Signal Clone Backend Running"
    }

@app.on_event("startup")
async def startup():
    seed_database()