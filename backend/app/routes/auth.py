from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.user import User
from app.models.conversation import Conversation
from app.models.conversation_member import ConversationMember

from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    UserResponse,
)

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)

from app.core.auth_dependency import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register")
def register(
    user: RegisterRequest,
    db: Session = Depends(get_db),
):

    # Check if username already exists
    existing_username = (
        db.query(User)
        .filter(User.username == user.username)
        .first()
    )

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already exists",
        )

    # Check if phone already exists
    existing_phone = (
        db.query(User)
        .filter(User.phone == user.phone)
        .first()
    )

    if existing_phone:
        raise HTTPException(
            status_code=400,
            detail="Phone number already exists",
        )

    db_user = User(
        username=user.username,
        display_name=user.display_name,
        phone=user.phone,
        password=hash_password(user.password),
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # -------------------------
    # Create Note to Self
    # -------------------------

    note = Conversation(
        name="Note to Self",
        avatar="",
        is_group=False,
        is_note=True,
    )

    db.add(note)
    db.commit()
    db.refresh(note)

    db.add(
        ConversationMember(
            conversation_id=note.id,
            user_id=db_user.id,
            is_admin=True,
        )
    )

    db.commit()

    return {
        "message": "User registered successfully",
    }


@router.post("/login")
def login(
    user: LoginRequest,
    db: Session = Depends(get_db),
):

    db_user = (
        db.query(User)
        .filter(User.username == user.username)
        .first()
    )

    if db_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid username",
        )

    if not verify_password(
        user.password,
        db_user.password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password",
        )

    token = create_access_token(
        {"sub": db_user.username}
    )

    return {
        "access_token": token,
        "token_type": "bearer",
    }


@router.get(
    "/me",
    response_model=UserResponse,
)
def me(
    current_user: User = Depends(get_current_user),
):
    return current_user