
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")

if not MONGODB_URL:
    raise ValueError("MONGODB_URL not found in .env file")

try:
    client = MongoClient(
        MONGODB_URL,
        serverSelectionTimeoutMS=10000
    )

    client.admin.command("ping")

    print("MongoDB Atlas Connected Successfully!")

    db = client["MedVisionDB"]
    print("Database:", db.name)

    client.close()

except Exception as error:
    print("MongoDB Connection Failed!")
    print(error)
