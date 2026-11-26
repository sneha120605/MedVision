
import os
import secrets
import smtplib

from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pymongo import MongoClient, ASCENDING
from pymongo.errors import DuplicateKeyError

from pwdlib import PasswordHash
from jose import jwt

from schemas import (
    PatientRegister,
    ResearcherRegister,
    VerifyRegistrationOTP,
    LoginRequest,
    VerifyLoginOTP
)


# ==================================================
# 1. LOAD ENVIRONMENT VARIABLES
# ==================================================

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_APP_PASSWORD = os.getenv("SMTP_APP_PASSWORD")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))

if not MONGODB_URL:
    raise ValueError("MONGODB_URL is missing in .env")

if not JWT_SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY is missing in .env")


# ==================================================
# 2. MONGODB CONNECTION
# ==================================================

client = MongoClient(
    MONGODB_URL,
    tz_aware=True
)

db = client["MedVisionDB"]

users_collection = db["users"]
patient_profiles_collection = db["patient_profiles"]
researcher_profiles_collection = db["researcher_profiles"]

pending_registrations_collection = db["pending_registrations"]
pending_logins_collection = db["pending_logins"]


# ==================================================
# 3. DATABASE INDEXES
# ==================================================

users_collection.create_index(
    [("email", ASCENDING)],
    unique=True
)

pending_registrations_collection.create_index(
    [("email", ASCENDING)],
    unique=True
)

pending_registrations_collection.create_index(
    [("expires_at", ASCENDING)],
    expireAfterSeconds=0
)

pending_logins_collection.create_index(
    [("email", ASCENDING)],
    unique=True
)

pending_logins_collection.create_index(
    [("expires_at", ASCENDING)],
    expireAfterSeconds=0
)


# ==================================================
# 4. PASSWORD HASHING
# ==================================================

password_hash = PasswordHash.recommended()


# ==================================================
# 5. FASTAPI APPLICATION
# ==================================================

app = FastAPI(
    title="MedVision API",
    description="Backend API for MedVision",
    version="2.0.0"
)


# ==================================================
# 6. CORS CONFIGURATION
# ==================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ==================================================
# 7. EMAIL SENDING FUNCTION
# ==================================================

def send_single_email(to_email: str, subject: str, body: str):

    if not SMTP_EMAIL or not SMTP_APP_PASSWORD:
        raise RuntimeError("SMTP settings are missing in .env")

    message = EmailMessage()

    message["Subject"] = subject
    message["From"] = SMTP_EMAIL
    message["To"] = to_email

    message.set_content(body)

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:

        server.starttls()

        server.login(
            SMTP_EMAIL,
            SMTP_APP_PASSWORD
        )

        server.send_message(message)


# ==================================================
# 8. SEND OTP EMAIL
# ==================================================

def send_otp_email(email: str, name: str, otp: str):

    subject = "MedVision - Email Verification OTP"

    body = f"""
Hello {name},

Your MedVision verification OTP is:

{otp}

This OTP is valid for 5 minutes.

Please do not share this OTP with anyone.

If you did not request this verification, please ignore this email.

Regards,
MedVision Team
"""

    send_single_email(
        email,
        subject,
        body
    )


# ==================================================
# 9. REGISTRATION CONFIRMATION EMAILS
# ==================================================

def send_registration_emails(
    name: str,
    email: str,
    role: str
):

    user_email_sent = False
    admin_email_sent = False

    # Email to registered user
    try:

        subject = "MedVision - Registration Successful"

        body = f"""
Hello {name},

Your MedVision {role} account has been successfully created.

Your email address has been verified.

Thank you for joining MedVision.

Regards,
MedVision Team
"""

        send_single_email(
            email,
            subject,
            body
        )

        user_email_sent = True

    except Exception as error:
        print("User confirmation email error:", error)


    # Notification to admin
    if ADMIN_EMAIL:

        try:

            subject = "MedVision - New User Registration"

            body = f"""
Hello Admin,

A new user has registered on MedVision.

Name: {name}
Email: {email}
Role: {role}
Registration Time: {datetime.now(timezone.utc).isoformat()}

Regards,
MedVision System
"""

            send_single_email(
                ADMIN_EMAIL,
                subject,
                body
            )

            admin_email_sent = True

        except Exception as error:
            print("Admin notification email error:", error)

    return {
        "user_email_sent": user_email_sent,
        "admin_email_sent": admin_email_sent
    }


# ==================================================
# 10. START REGISTRATION AND SEND OTP
# ==================================================

def start_registration(
    name: str,
    email: str,
    password: str,
    role: str,
    institution: str = None
):

    email = email.lower().strip()

    existing_user = users_collection.find_one({
        "email": email
    })

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )

    existing_pending = pending_registrations_collection.find_one({
        "email": email
    })

    now = datetime.now(timezone.utc)

    if existing_pending:

        last_sent = existing_pending.get("last_sent_at")

        if last_sent:

            elapsed = (now - last_sent).total_seconds()

            if elapsed < 60:
                raise HTTPException(
                    status_code=429,
                    detail="Please wait 60 seconds before requesting another OTP."
                )

    otp = f"{secrets.randbelow(1000000):06d}"

    pending_data = {
        "name": name,
        "email": email,
        "password": password_hash.hash(password),
        "otp_hash": password_hash.hash(otp),
        "role": role,
        "institution": institution,
        "attempts": 0,
        "created_at": now,
        "last_sent_at": now,
        "expires_at": now + timedelta(minutes=5)
    }

    pending_registrations_collection.replace_one(
        {"email": email},
        pending_data,
        upsert=True
    )

    try:

        send_otp_email(
            email,
            name,
            otp
        )

    except Exception as error:

        print("Registration OTP email error:", error)

        pending_registrations_collection.delete_one({
            "email": email
        })

        raise HTTPException(
            status_code=502,
            detail="Unable to send registration OTP."
        )

    return {
        "message": "Registration OTP sent successfully.",
        "otp_sent": True,
        "email": email
    }


# ==================================================
# 11. PATIENT REGISTRATION
# ==================================================

@app.post("/register/patient")
def register_patient(patient: PatientRegister):

    return start_registration(
        name=patient.name.strip(),
        email=str(patient.email),
        password=patient.password,
        role="patient"
    )


# ==================================================
# 12. RESEARCHER REGISTRATION
# ==================================================

@app.post("/register/researcher")
def register_researcher(researcher: ResearcherRegister):

    return start_registration(
        name=researcher.name.strip(),
        email=str(researcher.email),
        password=researcher.password,
        role="researcher",
        institution=researcher.institution
    )


# ==================================================
# 13. VERIFY REGISTRATION OTP
# ==================================================

@app.post("/verify-registration-otp")
def verify_registration_otp(data: VerifyRegistrationOTP):

    email = str(data.email).lower().strip()

    pending = pending_registrations_collection.find_one({
        "email": email
    })

    if not pending:
        raise HTTPException(
            status_code=404,
            detail="No pending registration found. Please register again."
        )

    now = datetime.now(timezone.utc)

    if now >= pending["expires_at"]:

        pending_registrations_collection.delete_one({
            "email": email
        })

        raise HTTPException(
            status_code=400,
            detail="Registration OTP expired. Please register again."
        )

    if pending.get("attempts", 0) >= 5:

        pending_registrations_collection.delete_one({
            "email": email
        })

        raise HTTPException(
            status_code=429,
            detail="Maximum OTP attempts exceeded. Please register again."
        )

    if not password_hash.verify(
        data.otp,
        pending["otp_hash"]
    ):

        pending_registrations_collection.update_one(
            {
                "email": email,
                "attempts": {"$lt": 5}
            },
            {
                "$inc": {"attempts": 1}
            }
        )

        raise HTTPException(
            status_code=400,
            detail="Invalid OTP. Please try again."
        )

    if users_collection.find_one({"email": email}):

        pending_registrations_collection.delete_one({
            "email": email
        })

        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )

    role = pending["role"]

    user_data = {
        "name": pending["name"],
        "email": email,
        "password": pending["password"],
        "role": role,
        "email_verified": True,
        "created_at": now
    }

    user_id = None

    try:

        user_result = users_collection.insert_one(user_data)
        user_id = user_result.inserted_id

        profile_data = {
            "user_id": user_id,
            "name": pending["name"],
            "email": email,
            "created_at": now
        }

        if role == "patient":

            patient_profiles_collection.insert_one(
                profile_data
            )

        elif role == "researcher":

            profile_data["institution"] = pending.get("institution")

            researcher_profiles_collection.insert_one(
                profile_data
            )

        else:

            raise HTTPException(
                status_code=400,
                detail="Invalid registration role."
            )

    except DuplicateKeyError:

        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )

    except HTTPException:
        raise

    except Exception as error:

        print("Registration account creation error:", error)

        if user_id:
            users_collection.delete_one({
                "_id": user_id
            })

        raise HTTPException(
            status_code=500,
            detail="Account creation failed."
        )

    pending_registrations_collection.delete_one({
        "email": email
    })

    email_status = send_registration_emails(
        name=pending["name"],
        email=email,
        role=role
    )

    return {
        "message": "Email verified and registration completed successfully.",
        "email_verified": True,
        "role": role,
        "user_email_sent": email_status["user_email_sent"],
        "admin_email_sent": email_status["admin_email_sent"]
    }


# ==================================================
# 14. LOGIN - VERIFY EMAIL AND PASSWORD
# ==================================================

@app.post("/login")
def login(data: LoginRequest):

    email = str(data.email).lower().strip()

    user = users_collection.find_one({
        "email": email
    })

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    if not password_hash.verify(
        data.password,
        user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    now = datetime.now(timezone.utc)

    existing = pending_logins_collection.find_one({
        "email": email
    })

    if existing:

        last_sent = existing.get("last_sent_at")

        if last_sent:

            elapsed = (now - last_sent).total_seconds()

            if elapsed < 60:
                raise HTTPException(
                    status_code=429,
                    detail="Please wait 60 seconds before requesting another login OTP."
                )

    otp = f"{secrets.randbelow(1000000):06d}"

    pending_login = {
        "email": email,
        "user_id": str(user["_id"]),
        "role": user["role"],
        "otp_hash": password_hash.hash(otp),
        "attempts": 0,
        "created_at": now,
        "last_sent_at": now,
        "expires_at": now + timedelta(minutes=5)
    }

    pending_logins_collection.replace_one(
        {"email": email},
        pending_login,
        upsert=True
    )

    try:

        send_otp_email(
            email,
            user.get("name", "User"),
            otp
        )

    except Exception as error:

        print("Login OTP email error:", error)

        pending_logins_collection.delete_one({
            "email": email
        })

        raise HTTPException(
            status_code=502,
            detail="Unable to send login OTP."
        )

    return {
        "message": "Login OTP sent to your registered email.",
        "otp_sent": True,
        "email": email
    }


# ==================================================
# 15. VERIFY LOGIN OTP AND GENERATE JWT
# ==================================================

@app.post("/verify-login-otp")
def verify_login_otp(data: VerifyLoginOTP):

    email = str(data.email).lower().strip()

    pending = pending_logins_collection.find_one({
        "email": email
    })

    if not pending:
        raise HTTPException(
            status_code=404,
            detail="No pending login found. Please login again."
        )

    now = datetime.now(timezone.utc)

    if now >= pending["expires_at"]:

        pending_logins_collection.delete_one({
            "email": email
        })

        raise HTTPException(
            status_code=400,
            detail="Login OTP expired. Please login again."
        )

    if pending.get("attempts", 0) >= 5:

        pending_logins_collection.delete_one({
            "email": email
        })

        raise HTTPException(
            status_code=429,
            detail="Maximum OTP attempts exceeded. Please login again."
        )

    if not password_hash.verify(
        data.otp,
        pending["otp_hash"]
    ):

        pending_logins_collection.update_one(
            {
                "email": email,
                "attempts": {"$lt": 5}
            },
            {
                "$inc": {"attempts": 1}
            }
        )

        raise HTTPException(
            status_code=400,
            detail="Incorrect OTP. Please try again."
        )

    user = users_collection.find_one({
        "email": email
    })

    if not user or str(user["_id"]) != pending["user_id"]:

        pending_logins_collection.delete_one({
            "email": email
        })

        raise HTTPException(
            status_code=404,
            detail="User account not found."
        )

    # Mark older verified accounts as email verified
    users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"email_verified": True}}
    )

    token_expiry = now + timedelta(
        minutes=JWT_EXPIRE_MINUTES
    )

    token_payload = {
        "sub": str(user["_id"]),
        "email": email,
        "role": user["role"],
        "exp": token_expiry
    }

    access_token = jwt.encode(
        token_payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )

    pending_logins_collection.delete_one({
        "email": email
    })

    return {
        "message": "Login successful.",
        "access_token": access_token,
        "token_type": "bearer",
        "role": user["role"],
        "email": email,
        "expires_in": JWT_EXPIRE_MINUTES * 60
    }


# ==================================================
# 16. HOME ROUTE
# ==================================================

@app.get("/")
def home():

    return {
        "message": "Welcome to MedVision API"
    }


# ==================================================
# 17. HEALTH CHECK
# ==================================================

@app.get("/health")
def health_check():

    try:

        client.admin.command("ping")

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as error:

        print("Database health check error:", error)

        raise HTTPException(
            status_code=503,
            detail="Database connection failed."
        )
