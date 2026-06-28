from pydantic import BaseModel


class SendMessageRequest(BaseModel):
    conversation_id: int
    content: str

class ReadMessageRequest(BaseModel):
    message_id: int