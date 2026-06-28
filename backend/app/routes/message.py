from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.message import Message
from app.models.user import User

from app.schemas.message import SendMessageRequest

from app.websocket import manager
from app.core.auth_dependency import get_current_user

router = APIRouter(
    prefix="/message",
    tags=["Messages"],
)


# ==========================
# Get Messages
# ==========================

@router.get("/{conversation_id}")
def get_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
):
    messages = (
        db.query(Message)
        .filter(
            Message.conversation_id == conversation_id
        )
        .order_by(Message.created_at)
        .all()
    )

    response = []

    for message in messages:
        sender = (
            db.query(User)
            .filter(User.id == message.sender_id)
            .first()
        )

        response.append(
            {
                "id": message.id,
                "conversation_id": message.conversation_id,
                "sender_id": message.sender_id,
                "sender_name": (
                    sender.display_name
                    if sender
                    else "Unknown"
                ),
                "content": message.content,
                "status": message.status,
                "created_at": (
                    message.created_at.isoformat()
                    if message.created_at
                    else None
                ),
            }
        )

    return response


# ==========================
# Send Message
# ==========================

@router.post("/send")
async def send_message(
    request: SendMessageRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    message = Message(
        conversation_id=request.conversation_id,
        sender_id=current_user.id,
        content=request.content,
        status="sent",
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    websocket_event = {
        "type": "message",
        "payload": {
            "id": message.id,
            "conversation_id": message.conversation_id,
            "sender_id": message.sender_id,
            "sender_name": current_user.display_name,
            "content": message.content,
            "status": message.status,
            "created_at": (
                message.created_at.isoformat()
                if message.created_at
                else None
            ),
        },
    }

    await manager.broadcast(websocket_event)

    return {
        "id": message.id,
        "conversation_id": message.conversation_id,
        "sender_id": message.sender_id,
        "sender_name": current_user.display_name,
        "content": message.content,
        "status": message.status,
        "created_at": (
            message.created_at.isoformat()
            if message.created_at
            else None
        ),
    }


# ==========================
# Delivered
# ==========================

@router.post("/delivered/{message_id}")
async def delivered_message(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    message = (
        db.query(Message)
        .filter(Message.id == message_id)
        .first()
    )

    if not message:
        raise HTTPException(
            status_code=404,
            detail="Message not found",
        )

    if message.sender_id == current_user.id:
        return message

    if message.status == "sent":
        message.status = "delivered"

        db.commit()
        db.refresh(message)

        await manager.broadcast(
            {
                "type": "delivered",
                "payload": {
                    "message_id": message.id,
                    "conversation_id": message.conversation_id,
                    "status": "delivered",
                },
            }
        )

    return message


# ==========================
# Delete Message
# ==========================

@router.delete("/{message_id}")
async def delete_message(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    message = (
        db.query(Message)
        .filter(Message.id == message_id)
        .first()
    )

    if not message:
        raise HTTPException(
            status_code=404,
            detail="Message not found",
        )

    if message.sender_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not allowed",
        )

    conversation_id = message.conversation_id

    db.delete(message)
    db.commit()

    await manager.broadcast(
        {
            "type": "message_deleted",
            "payload": {
                "message_id": message_id,
                "conversation_id": conversation_id,
            },
        }
    )

    return {
        "message": "Deleted successfully"
    }