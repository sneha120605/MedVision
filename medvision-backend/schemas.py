
from pydantic import BaseModel, EmailStr, Field


# -----------------------------------------
# PATIENT REGISTRATION
# -----------------------------------------

class PatientRegister(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8)


# -----------------------------------------
# RESEARCHER REGISTRATION
# -----------------------------------------

class ResearcherRegister(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    institution: str | None = None
    password: str = Field(min_length=8)


# -----------------------------------------
# REGISTRATION OTP VERIFICATION
# -----------------------------------------

class VerifyRegistrationOTP(BaseModel):
    email: EmailStr
    otp: str = Field(
        min_length=6,
        max_length=6,
        pattern=r"^\d{6}$"
    )


# -----------------------------------------
# LOGIN REQUEST
# -----------------------------------------

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


# -----------------------------------------
# LOGIN OTP VERIFICATION
# -----------------------------------------

class VerifyLoginOTP(BaseModel):
    email: EmailStr
    otp: str = Field(
        min_length=6,
        max_length=6,
        pattern=r"^\d{6}$"
    )
