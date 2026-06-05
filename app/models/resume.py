from sqlalchemy import Column, Integer, String,Text,ForeignKey,DateTime
from app.db.database import Base
from datetime import datetime    
from sqlalchemy.orm import relationship
class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)
    extracted_text = Column(Text, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    matched_skills = Column(Text, nullable=True)
    ai_analysis = Column(Text, nullable=True)
    owner = relationship("User", back_populates="resumes")