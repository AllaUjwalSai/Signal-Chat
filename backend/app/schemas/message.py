from pydantic import BaseModel


class SendMessageRequest(BaseModel):
    conversation_id: int
    content: str