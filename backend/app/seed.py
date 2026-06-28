from app.database.database import SessionLocal
from app.models.user import User
from app.models.conversation import Conversation
from app.models.conversation_member import ConversationMember
from app.models.message import Message

from app.core.security import hash_password

from app.database.database import (
    Base,
    engine,
    SessionLocal,
)

Base.metadata.create_all(bind=engine)

db = SessionLocal()

db = SessionLocal()

# Don't seed twice
if db.query(User).count() == 0:

    users = [
        User(
            username="alice",
            display_name="Alice",
            phone="1111111111",
            password=hash_password("123456"),
        ),
        User(
            username="bob",
            display_name="Bob",
            phone="2222222222",
            password=hash_password("123456"),
        ),
        User(
            username="charlie",
            display_name="Charlie",
            phone="3333333333",
            password=hash_password("123456"),
        ),
        User(
            username="david",
            display_name="David",
            phone="4444444444",
            password=hash_password("123456"),
        ),
        User(
            username="eva",
            display_name="Eva",
            phone="5555555555",
            password=hash_password("123456"),
        ),
    ]

    db.add_all(users)
    db.commit()

    users = db.query(User).all()

    convo1 = Conversation(name="Alice & Bob")
    convo2 = Conversation(name="Friends", is_group=True)

    db.add_all([convo1, convo2])
    db.commit()

    conversations = db.query(Conversation).all()

    db.add_all([
        ConversationMember(
            conversation_id=conversations[0].id,
            user_id=users[0].id,
            is_admin=True,
        ),
        ConversationMember(
            conversation_id=conversations[0].id,
            user_id=users[1].id,
        ),
        ConversationMember(
            conversation_id=conversations[1].id,
            user_id=users[0].id,
            is_admin=True,
        ),
        ConversationMember(
            conversation_id=conversations[1].id,
            user_id=users[1].id,
        ),
        ConversationMember(
            conversation_id=conversations[1].id,
            user_id=users[2].id,
        ),
    ])

    db.commit()

    db.add_all([
        Message(
            conversation_id=conversations[0].id,
            sender_id=users[0].id,
            content="Hey Bob!",
        ),
        Message(
            conversation_id=conversations[0].id,
            sender_id=users[1].id,
            content="Hey Alice 👋",
        ),
        Message(
            conversation_id=conversations[1].id,
            sender_id=users[2].id,
            content="Who's free this weekend?",
        ),
    ])

    db.commit()

print("✅ Database seeded successfully!")

db.close()