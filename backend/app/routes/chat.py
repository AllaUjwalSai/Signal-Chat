from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.conversation import Conversation
from app.models.conversation_member import ConversationMember
from app.models.user import User
from app.models.message import Message
from app.schemas.chat import CreateConversationRequest
from app.schemas.group import CreateGroupRequest
from app.core.auth_dependency import get_current_user
from app.schemas.group import (
    CreateGroupRequest,
    AddGroupMemberRequest,
)

router = APIRouter(
    prefix="/chat",
    tags=["Chats"],
)


# ==========================
# Get All Conversations
# ==========================

@router.get("/conversations")
def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Only fetch conversations that the current user belongs to
    conversations = (
        db.query(Conversation)
        .join(
            ConversationMember,
            Conversation.id == ConversationMember.conversation_id,
        )
        .filter(
            ConversationMember.user_id == current_user.id
        )
        .order_by(Conversation.created_at.desc())
        .all()
    )

    response = []

    for conversation in conversations:

        # -------------------------
        # NOTE TO SELF
        # -------------------------

        if conversation.is_note:

            last = (
                db.query(Message)
                .filter(
                    Message.conversation_id == conversation.id
                )
                .order_by(Message.created_at.desc())
                .first()
            )

            response.append(
                {
                    "id": conversation.id,
                    "display_name": "📝 Note to Self",
                    "avatar": "",
                    "last_message": last.content if last else "",
                    "is_note": True,
                }
            )

            continue

        # -------------------------
        # GROUP CHAT
        # -------------------------

        if conversation.is_group:

            last = (
                db.query(Message)
                .filter(
                    Message.conversation_id == conversation.id
                )
                .order_by(Message.created_at.desc())
                .first()
            )

            response.append(
                {
                    "id": conversation.id,
                    "display_name": conversation.name,
                    "avatar": conversation.avatar,
                    "last_message": last.content if last else "",
                    "is_group": True,
                }
            )

            continue

        # -------------------------
        # DIRECT CHAT
        # -------------------------

        member = (
            db.query(ConversationMember)
            .filter(
                ConversationMember.conversation_id == conversation.id,
                ConversationMember.user_id != current_user.id,
            )
            .first()
        )

        if not member:
            continue

        user = (
            db.query(User)
            .filter(User.id == member.user_id)
            .first()
        )

        if not user:
            continue

        last = (
            db.query(Message)
            .filter(
                Message.conversation_id == conversation.id
            )
            .order_by(Message.created_at.desc())
            .first()
        )

        response.append(
            {
                "id": conversation.id,
                "user_id": user.id,
                "display_name": user.display_name,
                "avatar": user.avatar or "",
                "last_message": last.content if last else "",
                "is_group": False,
            }
        )

    return response

# ==========================
# Create Direct Conversation
# ==========================

@router.post("/conversations")
def create_conversation(
    request: CreateConversationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    # Prevent duplicate chats

    existing = (
        db.query(ConversationMember)
        .filter(ConversationMember.user_id == current_user.id)
        .all()
    )

    for member in existing:

        conversation = (
            db.query(Conversation)
            .filter(
                Conversation.id == member.conversation_id,
                Conversation.is_group == False,
            )
            .first()
        )

        if not conversation:
            continue

        second = (
            db.query(ConversationMember)
            .filter(
                ConversationMember.conversation_id == conversation.id,
                ConversationMember.user_id == request.user2_id,
            )
            .first()
        )

        if second:
            return conversation

    conversation = Conversation(
        name="",
        avatar="",
        is_group=False,
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    db.add_all(
        [
            ConversationMember(
                conversation_id=conversation.id,
                user_id=current_user.id,
                is_admin=False,
            ),
            ConversationMember(
                conversation_id=conversation.id,
                user_id=request.user2_id,
                is_admin=False,
            ),
        ]
    )

    db.commit()

    return conversation


# ==========================
# Create Group
# ==========================

@router.post("/groups")
def create_group(
    request: CreateGroupRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    members = set(request.members)
    members.add(current_user.id)

    if len(members) < 2:
        raise HTTPException(
            status_code=400,
            detail="A group must contain at least two members.",
        )

    if not request.name.strip():
        raise HTTPException(
            status_code=400,
            detail="Group name cannot be empty.",
        )

    group = Conversation(
        name=request.name,
        avatar="",
        is_group=True,
    )

    db.add(group)
    db.commit()
    db.refresh(group)

    for user_id in members:
        db.add(
            ConversationMember(
                conversation_id=group.id,
                user_id=user_id,
                is_admin=(user_id == current_user.id),
            )
        )

    db.commit()

    return group

# ==========================
# Get Group Members
# ==========================

# ==========================
# Get Group Members
# ==========================

@router.get("/groups/{group_id}")
def get_group(
    group_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    members = (
        db.query(User)
        .join(
            ConversationMember,
            User.id == ConversationMember.user_id,
        )
        .filter(
            ConversationMember.conversation_id == group_id
        )
        .all()
    )

    return [
        {
            "user_id": user.id,
            "display_name": user.display_name,
            "username": user.username,
            "avatar": user.avatar,
        }
        for user in members
    ]   

# ==========================
# Remove Group Member
# ==========================

@router.delete("/groups/{group_id}/members/{user_id}")
def remove_group_member(
    group_id: int,
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    member = (
        db.query(ConversationMember)
        .filter(
            ConversationMember.conversation_id == group_id,
            ConversationMember.user_id == user_id,
        )
        .first()
    )

    if not member:
        raise HTTPException(
            status_code=404,
            detail="Member not found",
        )

    db.delete(member)
    db.commit()

    return {
        "message": "Member removed successfully"
    }

@router.post("/groups/{group_id}/members")
def add_group_member(
    group_id: int,
    request: AddGroupMemberRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    group = (
        db.query(Conversation)
        .filter(
            Conversation.id == group_id,
            Conversation.is_group == True,
        )
        .first()
    )

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found",
        )

    user = (
        db.query(User)
        .filter(User.username == request.username)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    existing = (
        db.query(ConversationMember)
        .filter(
            ConversationMember.conversation_id == group_id,
            ConversationMember.user_id == user.id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="User already in group",
        )

    db.add(
        ConversationMember(
            conversation_id=group_id,
            user_id=user.id,
            is_admin=False,
        )
    )

    db.commit()

    return {
        "message": "Member added successfully"
    }

@router.post("/notes")
def create_notes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = (
        db.query(Conversation)
        .join(
            ConversationMember,
            Conversation.id == ConversationMember.conversation_id,
        )
        .filter(
            Conversation.is_note == True,
            ConversationMember.user_id == current_user.id,
        )
        .first()
    )

    if existing:
        return existing

    conversation = Conversation(
        name="Note to Self",
        avatar="",
        is_group=False,
        is_note=True,
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    db.add(
        ConversationMember(
            conversation_id=conversation.id,
            user_id=current_user.id,
            is_admin=True,
        )
    )

    db.commit()

    return conversation