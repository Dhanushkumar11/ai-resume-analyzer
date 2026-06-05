from fastapi import FastAPI,Depends
from app.auth.routes import router as auth_router
from app.resume.routes import router as resume_router
from app.db.database import Base, engine
from app.models.user import User
from app.models.resume import Resume
Base.metadata.create_all(bind=engine)
app = FastAPI()
app.include_router(auth_router, prefix="/auth")
app.include_router(resume_router, prefix="/resume")
