from app.database.database import (
    Base,
    engine,
    SessionLocal,
)

from app.models.user import User
from app.models.conversation import Conversation
from app.models.conversation_member import ConversationMember
from app.models.message import Message

from app.core.security import hash_password

import random


Base.metadata.create_all(bind=engine)


def seed_database():
    db = SessionLocal()

    # Already seeded
    if db.query(User).count() > 0:
        print("Database already seeded.")
        db.close()
        return

    # ==========================
    # Users
    # ==========================

    users_data = [
        ("alice", "Alice", "1111111111"),
        ("bob", "Bob", "2222222222"),
        ("charlie", "Charlie", "3333333333"),
        ("david", "David", "4444444444"),
        ("eva", "Eva", "5555555555"),
        ("frank", "Frank", "6666666666"),
        ("grace", "Grace", "7777777777"),
        ("henry", "Henry", "8888888888"),
    ]

    db.add_all(
        [
            User(
                username=username,
                display_name=display_name,
                phone=phone,
                password=hash_password("123456"),
            )
            for username, display_name, phone in users_data
        ]
    )

    db.commit()

    users = (
        db.query(User)
        .order_by(User.id)
        .all()
    )

    # ==========================
    # Conversations
    # ==========================

    conversations = [
        Conversation(
            name="",
            avatar="",
            is_group=False,
        ),
        Conversation(
            name="",
            avatar="",
            is_group=False,
        ),
        Conversation(
            name="",
            avatar="",
            is_group=False,
        ),
        Conversation(
            name="",
            avatar="",
            is_group=False,
        ),
        Conversation(
            name="Weekend Plans",
            avatar="",
            is_group=True,
        ),
        Conversation(
            name="Project Team",
            avatar="",
            is_group=True,
        ),
        Conversation(
            name="Note to Self",
            avatar="",
            is_group=False,
            is_note=True,
        ),
    ]

    db.add_all(conversations)
    db.commit()

    conversations = (
        db.query(Conversation)
        .order_by(Conversation.id)
        .all()
    )

    # ==========================
    # Members
    # ==========================

    mapping = {
        0: [0, 1],
        1: [0, 2],
        2: [3, 4],
        3: [5, 6],
        4: [0, 1, 2, 3],
        5: [2, 4, 5, 7],
        6: [0],
    }

    for conversation_index, members in mapping.items():

        for member in members:

            db.add(
                ConversationMember(
                    conversation_id=conversations[
                        conversation_index
                    ].id,
                    user_id=users[member].id,
                    is_admin=(
                        conversation_index
                        in [4, 6]
                        and member == 0
                    ),
                )
            )

    db.commit()

    # ==========================
    # Initial Messages
    # ==========================

    base_messages = [
        (0, 0, "Hey Bob!"),
        (0, 1, "Hey Alice 👋"),
        (0, 0, "Interview tomorrow?"),
        (0, 1, "Ready!"),
        (1, 2, "Lunch today?"),
        (1, 0, "Sure."),
        (2, 3, "Need report."),
        (2, 4, "Uploading."),
        (3, 5, "Game?"),
        (3, 6, "Yep."),
        (4, 0, "Who's free this weekend?"),
        (4, 1, "I'm in!"),
        (4, 2, "Let's go."),
        (4, 3, "Works."),
        (5, 2, "Sprint at 10."),
        (5, 4, "Slides ready."),
        (5, 5, "Backend done."),
        (5, 7, "Frontend done."),
        (6, 0, "Remember assignment."),
    ]

    messages = []

    for conversation, sender, content in base_messages:

        messages.append(
            Message(
                conversation_id=conversations[
                    conversation
                ].id,
                sender_id=users[sender].id,
                content=content,
                status="read",
            )
        )

    filler = [
        "Sounds good!",
        "Okay.",
        "Done.",
        "Thanks!",
        "See you.",
        "Perfect.",
        "I'll check.",
        "On my way.",
        "Great!",
        "Nice.",
        "Let's do it.",
        "Can you send the file?",
        "Looks good.",
        "Awesome!",
        "No worries.",
        "Talk later.",
        "I'll be there.",
        "Good morning!",
        "See you tomorrow.",
        "Thanks 😊",
    ]

    for _ in range(40):

        conversation = random.randint(0, 5)

        sender = random.choice(
            mapping[conversation]
        )

        messages.append(
            Message(
                conversation_id=conversations[
                    conversation
                ].id,
                sender_id=users[sender].id,
                content=random.choice(filler),
                status=random.choice(
                    [
                        "sent",
                        "delivered",
                        "read",
                    ]
                ),
            )
        )

    db.add_all(messages)

    db.commit()

    print("Database seeded successfully!")

    db.close()


if __name__ == "__main__":
    seed_database()