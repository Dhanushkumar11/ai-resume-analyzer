from pydantic import BaseModel, EmailStr,Field

class RegisterData(BaseModel):
    name: str=Field(...,min_length=3)
    email: EmailStr
    password:str=Field(...,min_length=8)
class RegisterCreate(RegisterData):
    pass
class RegisterResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    class Config:
        from_attributes = True

class LoginData(BaseModel):
    email: EmailStr
    password: str
class LoginResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    class Config:
        from_attributes = True            
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
