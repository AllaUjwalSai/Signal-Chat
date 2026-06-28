from pydantic import BaseModel


class ReadReceiptRequest(BaseModel):
    message_id: int