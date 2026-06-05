from fastapi import APIRouter,UploadFile,File,Depends,HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.auth.utils import get_current_user
from app.models.user import User
from app.models.resume import Resume    
from app.ai.service import generate_response
from app.db.database import get_db
import os,json
import pdfplumber

from app.resume.schemas import ResumeDetailResponse, ResumeListResponse
router=APIRouter()

@router.post("/upload")
async def upload_resume(upload_file: UploadFile = File(...), 
current_user: User = Depends(get_current_user), 
db: Session = Depends(get_db)):

   
    if upload_file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PDF is allowed."
        )

    
    os.makedirs("uploads", exist_ok=True)

    
    file_location = os.path.join(
        "uploads",
        upload_file.filename
    )

    
    with open(file_location, "wb") as buffer:
        content = await upload_file.read()
        buffer.write(content)

    
    extracted_text = ""

    with pdfplumber.open(file_location) as pdf:

        for page in pdf.pages:

            text = page.extract_text()
            if text:
                extracted_text += text + "\n"
    
    short_resume = extracted_text[:3000] 
    try:
        ai_response = generate_response(short_resume)

    except Exception as e:
        print("AI ERROR:", e)
        ai_response = f"AI analysis failed: {str(e)}"         
    skill_list=["Python","Java","C++","JavaScript","SQL","HTML","CSS","Django","Flask","React","Angular","Node.js"
            ,"AWS","Azure","GCP","Docker","Kubernetes","Git","Linux","Machine Learning","Data Analysis",]
    matched_skills = []
    normalized_text = extracted_text.lower()
    for skill in skill_list:
        if skill.lower() in normalized_text:
            matched_skills.append(skill)

    resume=Resume(
        filename=upload_file.filename,
        filepath=file_location,
        extracted_text=extracted_text,
        owner_id=current_user.id,
        matched_skills=",".join(matched_skills),
        ai_analysis=json.dumps(ai_response)
    )
    db.add(resume)
    db.commit() 
    db.refresh(resume)        
    return {
        "id": resume.id,
        "filename": upload_file.filename,
        "text": extracted_text,
        "matched_skills": matched_skills,
        "ai_analysis": ai_response
    }

@router.get("/my-resumes",response_model=list[ResumeListResponse])
def get_my_resumes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resumes = db.query(Resume).filter(Resume.owner_id == current_user.id).all()
    return resumes
@router.get("/resumes/{resume_id}",response_model=ResumeDetailResponse)
def get_resume_detail(resume_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.owner_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {
    "id": resume.id,
    "filename": resume.filename,
    "extracted_text": resume.extracted_text,
    "matched_skills": resume.matched_skills,
    "ai_analysis": json.loads(resume.ai_analysis),
    "created_at": resume.created_at
}
@router.delete("/resumes/{resume_id}")
def delete_resume(resume_id:int,current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.owner_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if os.path.exists(resume.filepath):
        os.remove(resume.filepath)
    db.delete(resume)
    db.commit()
    return {"detail": "Resume deleted successfully"}