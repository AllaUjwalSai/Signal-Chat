# Signal Clone

A full-stack real-time messaging application inspired by **Signal Messenger**, built using **Next.js**, **FastAPI**, **SQLite**, and **WebSockets**.

The project recreates Signal's core messaging experience, including one-to-one chats, group conversations, typing indicators, delivery/read receipts, online presence, and a modern chat interface.

---

## Features

### Authentication
- Mock registration with OTP verification
- Login & Logout
- Session persistence using JWT

### Conversations
- One-to-one conversations
- Group conversations
- Note to Self
- Conversation search
- Unread message indicators
- Last message preview
- Online / Offline presence

### Messaging
- Real-time messaging using WebSockets
- Message persistence
- Delivery receipts
- Read receipts
- Typing indicators
- Message timestamps
- Delete messages
- Sender names in group chats

### Groups
- Create groups
- View group members
- Add members
- Remove members

### Signal UI
- Signal-inspired layout
- Responsive chat interface
- Modern message bubbles
- Sidebar conversation list
- Placeholder pages for:
  - Profile
  - Settings
  - Privacy
  - Notifications
  - Appearance
  - Linked Devices

---

## Tech Stack

### Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS
- Zustand
- Axios
- Lucide Icons

### Backend

- FastAPI
- SQLAlchemy
- SQLite
- JWT Authentication
- WebSockets

---

## Project Structure

```
Signal-Chat/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── store/
│   ├── lib/
│   ├── types/
│   └── public/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── database/
│   │   ├── websocket.py
│   │   └── main.py
│   │
│   ├── seed.py
│   └── requirements.txt
│
└── README.md
```

---

## Database Design

### User

| Field |
|------|
| id |
| username |
| display_name |
| phone |
| password |
| avatar |

---

### Conversation

| Field |
|------|
| id |
| name |
| avatar |
| is_group |
| is_note |

---

### ConversationMember

| Field |
|------|
| id |
| conversation_id |
| user_id |
| is_admin |

---

### Message

| Field |
|------|
| id |
| conversation_id |
| sender_id |
| content |
| status |
| created_at |

---

## Architecture

```
Next.js Frontend
        │
        │ REST API
        ▼
FastAPI Backend
        │
 SQLAlchemy ORM
        ▼
     SQLite

        ▲
        │
   WebSockets
        │
 Real-time Events
```

---

## WebSocket Events

### Message

```
message
```

Broadcasts newly sent messages.

### Typing

```
typing
stop_typing
```

Shows typing indicators.

### Delivery Receipt

```
delivered
```

Updates single tick to double tick.

### Read Receipt

```
read
```

Updates message to blue ticks.

### Presence

```
presence
```

Updates online/offline status.

### Delete Message

```
message_deleted
```

Removes deleted messages from all clients.

---

## REST API

### Authentication

```
POST /auth/register
POST /auth/login
GET  /auth/me
```

### Conversations

```
GET  /chat/conversations
POST /chat/conversations
```

### Groups

```
POST   /chat/groups
GET    /chat/groups/{id}
POST   /chat/groups/{id}/members
DELETE /chat/groups/{id}/members/{user}
```

### Messages

```
GET    /message/{conversation_id}
POST   /message/send
POST   /message/read
POST   /message/delivered/{id}
DELETE /message/{id}
```

---

## Seed Data

The project includes a database seed script containing

- 8 users
- Multiple one-to-one chats
- Multiple group chats
- Note to Self conversation
- 50+ messages
- Random message statuses

Run:

```bash
python seed.py
```

---

## Installation

### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python seed.py

uvicorn app.main:app --reload
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Default Users

| Username | Password |
|----------|----------|
| alice | 123456 |
| bob | 123456 |
| charlie | 123456 |
| david | 123456 |
| eva | 123456 |
| frank | 123456 |
| grace | 123456 |
| henry | 123456 |

---

## Current Features Completed

- Mock OTP Authentication
- Session Persistence
- One-to-One Messaging
- Group Messaging
- Add Members
- Remove Members
- Conversation Search
- Message Search
- Delivery Receipts
- Read Receipts
- Typing Indicators
- Online Presence
- Delete Messages
- Note to Self
- Placeholder Settings Pages
- Real-time WebSocket Communication

---

## Assumptions

- Phone verification is mocked using a fixed OTP.
- End-to-end encryption is simulated and not implemented.
- Voice and video calls are placeholders.
- Linked devices are placeholders.
- Privacy and notification settings are placeholders.
- SQLite is used for simplicity and local development.

---

## Future Improvements

- File and Image Attachments
- Emoji Reactions
- Reply to Messages
- Voice Messages
- Disappearing Messages
- Dark Mode
- Push Notifications
- Mobile Responsive Enhancements
- End-to-End Encryption

---

## Author

**Alla Ujwal Sai**

B.Tech Artificial Intelligence & Data Science

KL University, Hyderabad

```

This README is comprehensive and aligns well with the evaluation criteria: it documents the architecture, database schema, APIs, setup, seed data, assumptions, and completed features in a way that makes the project easy to understand and run.