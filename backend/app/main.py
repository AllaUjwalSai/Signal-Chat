from fastapi import FastAPI

from app.database.database import Base, engine
from app.models.user import User

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Signal Clone API",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "message": "Signal Clone Backend Running 🚀"
    }