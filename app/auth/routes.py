from app.auth.schemas import RegisterCreate,RegisterResponse,LoginData,LoginResponse, TokenResponse
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.auth.utils import hash_password,verify_password,create_access_token,get_current_user
from app.models.user import User

router=APIRouter()
@router.post("/register",response_model=RegisterResponse)
def register(data: RegisterCreate,db:Session=Depends(get_db)):
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = hash_password(data.password)  
    db_user = User(name=data.name, email=data.email, password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user 

@router.post("/login",response_model=TokenResponse)
def login(data: LoginData, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    if not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    access_token = create_access_token({"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"} 
@router.get("/me",response_model=LoginResponse) 
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user 
