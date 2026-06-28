from pydantic import BaseModel


class CreateConversationRequest(BaseModel):
    user2_id: int