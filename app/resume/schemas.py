from pydantic import BaseModel
from datetime import datetime


class ResumeListResponse(BaseModel):
    id: int
    filename: str
    created_at: datetime

    class Config:
        from_attributes = True


class ResumeDetailResponse(BaseModel):
    id: int
    filename: str
    extracted_text: str
    matched_skills: str
    ai_analysis: str
    created_at: datetime

    class Config:
        from_attributes = True