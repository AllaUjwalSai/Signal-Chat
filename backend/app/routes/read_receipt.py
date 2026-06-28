from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.message import Message
from app.models.user import User

from app.schemas.read_receipt import ReadReceiptRequest

from app.core.auth_dependency import get_current_user
from app.websocket import manager

router = APIRouter(
    prefix="/message",
    tags=["Messages"],
)


@router.post("/read")
async def read_message(
    request: ReadReceiptRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    message = (
        db.query(Message)
        .filter(Message.id == request.message_id)
        .first()
    )

    if not message:
        raise HTTPException(
            status_code=404,
            detail="Message not found",
        )

    if message.sender_id == current_user.id:
        return {
            "message": "Own message"
        }

    message.status = "read"

    db.commit()
    db.refresh(message)

    await manager.broadcast(
        {
            "type": "read",
            "payload": {
                "message_id": message.id,
                "conversation_id": message.conversation_id,
                "status": "read",
            },
        }
    )

    return message