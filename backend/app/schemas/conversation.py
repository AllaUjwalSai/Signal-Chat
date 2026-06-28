from pydantic import BaseModel


class ConversationResponse(BaseModel):
    id: int
    display_name: str
    avatar: str
    last_message: str | None = None

    class Config:
        from_attributes = True