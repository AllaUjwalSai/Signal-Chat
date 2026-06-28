from pydantic import BaseModel


class CreateGroupRequest(BaseModel):
    name: str
    members: list[int]

class AddGroupMemberRequest(BaseModel):
    username: str