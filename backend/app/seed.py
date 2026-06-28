# seed.py
from app.database.database import Base, engine, SessionLocal
from app.models.user import User
from app.models.conversation import Conversation
from app.models.conversation_member import ConversationMember
from app.models.message import Message
from app.core.security import hash_password
import random

Base.metadata.create_all(bind=engine)
db=SessionLocal()

if db.query(User).count()==0:
    data=[
("alice","Alice","1111111111"),("bob","Bob","2222222222"),("charlie","Charlie","3333333333"),
("david","David","4444444444"),("eva","Eva","5555555555"),("frank","Frank","6666666666"),
("grace","Grace","7777777777"),("henry","Henry","8888888888")]
    db.add_all([User(username=u,display_name=d,phone=p,password=hash_password("123456")) for u,d,p in data]); db.commit()
    users=db.query(User).order_by(User.id).all()
    convos=[
      Conversation(is_group=False),Conversation(is_group=False),
      Conversation(is_group=False),Conversation(is_group=False),
      Conversation(name="Weekend Plans",is_group=True),
      Conversation(name="Project Team",is_group=True),
      Conversation(name="Note to Self",is_group=False,is_note=True)]
    db.add_all(convos); db.commit()
    convos=db.query(Conversation).order_by(Conversation.id).all()
    mapping={0:[0,1],1:[0,2],2:[3,4],3:[5,6],4:[0,1,2,3],5:[2,4,5,7],6:[0]}
    for ci,ul in mapping.items():
        for uid in ul:
            db.add(ConversationMember(conversation_id=convos[ci].id,user_id=users[uid].id,is_admin=(ci in [4,6] and uid==0)))
    db.commit()
    base=[
(0,0,"Hey Bob!"),(0,1,"Hey Alice 👋"),(0,0,"Interview tomorrow?"),(0,1,"Ready!"),
(1,2,"Lunch today?"),(1,0,"Sure."),(2,3,"Need report."),(2,4,"Uploading."),
(3,5,"Game?"),(3,6,"Yep."),
(4,0,"Who's free this weekend?"),(4,1,"I'm in!"),(4,2,"Let's go."),(4,3,"Works."),
(5,2,"Sprint at 10."),(5,4,"Slides ready."),(5,5,"Backend done."),(5,7,"Frontend done."),
(6,0,"Remember assignment.")]
    msgs=[Message(conversation_id=convos[c].id,sender_id=users[u].id,content=t,status="read") for c,u,t in base]
    filler=["Sounds good.","Okay.","Done.","Thanks!","See you.","Perfect.","I'll check.","On my way.","Great!","Nice."]
    for _ in range(40):
        c=random.randint(0,5)
        uid=random.choice(mapping[c])
        msgs.append(Message(conversation_id=convos[c].id,sender_id=users[uid].id,content=random.choice(filler),status=random.choice(["sent","delivered","read"])))
    db.add_all(msgs); db.commit()
print("Seed complete")
db.close()
