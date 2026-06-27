from sqlalchemy import Boolean, Column, Integer, String
from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    display_name = Column(String(100), nullable=False)
    phone = Column(String(20), unique=True)
    password = Column(String(255), nullable=False)
    avatar = Column(String(255), default="")
    is_online = Column(Boolean, default=False)