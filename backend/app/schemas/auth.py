from pydantic import BaseModel


class RegisterRequest(BaseModel):
    username: str
    display_name: str
    phone: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    username: str
    display_name: str
    phone: str
    avatar: str | None = ""

    class Config:
        from_attributes = True