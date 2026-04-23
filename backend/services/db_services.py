import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def save_quiz_attempt(data: dict):
    response = supabase.table("quiz_attempts").insert(data).execute()
    return response


def get_all_attempts(user_id: str):
    response = supabase.table("quiz_attempts").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return response.data


def get_recent_attempts(user_id: str, limit: int = 5):
    response = supabase.table("quiz_attempts").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(limit).execute()
    return response.data

def save_interview_attempt(data: dict):
    response = supabase.table("interview_attempts").insert(data).execute()
    return response

def get_all_interviews(user_id: str):
    response = supabase.table("interview_attempts").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return response.data

def get_recent_interviews(user_id: str, limit: int = 5):
    response = supabase.table("interview_attempts").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(limit).execute()
    return response.data