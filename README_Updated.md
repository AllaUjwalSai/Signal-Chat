# Signal Clone

A full-stack real-time messaging application inspired by Signal Messenger, built using Next.js, FastAPI, SQLite, and WebSockets. The project recreates Signal's core messaging experience, including one-to-one chats, group conversations, typing indicators, delivery/read receipts, online presence, dark mode, emoji support, and a modern chat interface.

## Features

### Authentication

* Mock registration with OTP verification
* Login & Logout
* Session persistence using JWT

### Conversations

* One-to-one conversations
* Group conversations
* Note to Self
* Conversation search
* Unread message indicators
* Last message preview
* Online / Offline presence

### Messaging

* Real-time messaging using WebSockets
* Message persistence
* Delivery receipts
* Read receipts
* Typing indicators
* Message timestamps
* Delete messages
* Sender names in group chats
* Emoji picker

### Groups

* Create groups
* View group members
* Add members
* Remove members

### Signal UI

* Signal-inspired layout
* Responsive chat interface
* Modern message bubbles
* Sidebar conversation list
* Light & Dark Mode
* Placeholder pages for Profile, Settings, Privacy, Notifications, Appearance, and Linked Devices

## Tech Stack

| Frontend | Backend | 
| ----- | ----- | 
| Next.js | FastAPI | 
| TypeScript | SQLAlchemy | 
| React | SQLite | 
| Tailwind CSS | JWT Authentication | 
| Zustand | WebSockets | 
| Axios |  | 
| Lucide Icons |  | 
| Emoji Picker React |  | 

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
| ----- | 
| `id` | 
| `username` | 
| `display_name` | 
| `phone` | 
| `password` | 
| `avatar` | 

### Conversation

| Field | 
| ----- | 
| `id` | 
| `name` | 
| `avatar` | 
| `is_group` | 
| `is_note` | 

### ConversationMember

| Field | 
| ----- | 
| `id` | 
| `conversation_id` | 
| `user_id` | 
| `is_admin` | 

### Message

| Field | 
| ----- | 
| `id` | 
| `conversation_id` | 
| `sender_id` | 
| `content` | 
| `status` | 
| `created_at` | 

## Architecture



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


## WebSocket Events

| Event | Action | Description | 
| ----- | ----- | ----- | 
| **message** | Message | Broadcasts newly sent messages. | 
| **typing / stop_typing** | Typing | Shows typing indicators. | 
| **delivered** | Delivery Receipt | Updates single tick to double tick. | 
| **read** | Read Receipt | Updates message to blue ticks. | 
| **presence** | Presence | Updates online/offline status. | 
| **message_deleted** | Delete Message | Removes deleted messages from all clients. | 

## REST API

| Method | Endpoint | Category | 
| ----- | ----- | ----- | 
| POST | `/auth/register` | Authentication | 
| POST | `/auth/login` | Authentication | 
| GET | `/auth/me` | Authentication | 
| GET | `/chat/conversations` | Conversations | 
| POST | `/chat/conversations` | Conversations | 
| POST | `/chat/groups` | Groups | 
| GET | `/chat/groups/{id}` | Groups | 
| POST | `/chat/groups/{id}/members` | Groups | 
| DELETE | `/chat/groups/{id}/members/{user}` | Groups | 
| GET | `/message/{conversation_id}` | Messages | 
| POST | `/message/send` | Messages | 
| POST | `/message/read` | Messages | 
| POST | `/message/delivered/{id}` | Messages | 
| DELETE | `/message/{id}` | Messages | 

## Installation

### Backend



cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python seed.py
uvicorn app.main:app --reload


### Frontend



cd frontend
npm install
npm run dev


## Seed Data

The project includes a database seed script containing:

* 8 users
* Multiple one-to-one chats
* Multiple group chats
* Note to Self conversation
* 50+ messages
* Random message statuses

**To run the seed script:**



python seed.py


### Default Users

| Username | Password | 
| ----- | ----- | 
| alice | 123456 | 
| bob | 123456 | 
| charlie | 123456 | 
| david | 123456 | 
| eva | 123456 | 
| frank | 123456 | 
| grace | 123456 | 
| henry | 123456 | 

## Current Features Completed

* Mock OTP Authentication
* Session Persistence
* One-to-One Messaging
* Group Messaging
* Add / Remove Members
* Conversation Search
* Delivery & Read Receipts
* Typing Indicators
* Online Presence
* Delete Messages
* Note to Self
* Emoji Picker
* Dark Mode
* Placeholder Settings Pages
* Real-time WebSocket Communication

## Assumptions

* Phone verification is mocked using a fixed OTP.
* End-to-end encryption is simulated and not implemented.
* Voice and video calls are placeholders.
* Linked devices are placeholders.
* Privacy and notification settings are placeholders.
* SQLite is used for simplicity and local development.

## Future Improvements

* File and Image Attachments
* Emoji Reactions
* Reply to Messages
* Voice Messages
* Disappearing Messages
* Push Notifications
* Mobile Responsive Enhancements
* End-to-End Encryption

## Author

**Alla Ujwal Sai** B.Tech Artificial Intelligence & Data Science  
KL University, Hyderabad
