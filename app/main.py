from fastapi import FastAPI,Depends
from app.auth.routes import router as auth_router
from app.resume.routes import router as resume_router
from app.db.database import Base, engine
from app.models.user import User
from app.models.resume import Resume
from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://resumeiq-frontend-rzkf.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router, prefix="/api/auth")
app.include_router(resume_router, prefix="/api/resume")
