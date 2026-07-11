from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import shutil
import tempfile
import os
from backend.services.question_service import generate_quiz
from backend.services.submit_service import submit_quiz
from backend.services.dashboard_service import get_dashboard_data
from backend.services.interview_service import start_interview, submit_interview_answer
from backend.models.schema import (
    QuizRequest, 
    SubmitQuizRequest, 
    InterviewStartRequest, 
    InterviewAnswerRequest,
    UserSignUp,
    UserLogin
)
from backend.services.auth_service import signup_user, login_user, get_current_user
from backend.services.resume_service import process_resume, get_resume_metadata, delete_user_resume

app = FastAPI()

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/auth/signup")
def signup(data: UserSignUp):
    try:
        response = signup_user(data.email, data.password)
        return {"status": "success", "user": response.user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/auth/login")
def login(data: UserLogin):
    try:
        response = login_user(data.email, data.password)
        return {"status": "success", "session": response.session}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/generate-questions")
def generate_questions(data: QuizRequest, user_id: str = Depends(get_current_user)):
    return generate_quiz(data.subject, data.topic, data.level, data.num_questions)


@app.post("/submit-quiz")
def submit_quiz_api(data: SubmitQuizRequest, user_id: str = Depends(get_current_user)):
    questions = [q.dict() for q in data.questions]
    answers = data.answers

    return submit_quiz(
        data.subject,
        data.topic,
        data.level,
        questions,
        answers,
        user_id
    )

@app.get("/dashboard")
def dashboard(user_id: str = Depends(get_current_user)):
    return get_dashboard_data(user_id)

@app.post("/start-interview")
def start_interview_api(data: InterviewStartRequest, user_id: str = Depends(get_current_user)):
    return start_interview(data.role, data.level, user_id, data.total_questions)


@app.post("/submit-interview-answer")
def submit_interview_answer_api(data: InterviewAnswerRequest, user_id: str = Depends(get_current_user)):
    return submit_interview_answer(data.session_id, data.answer)


@app.post("/upload-resume")
async def upload_resume_api(file: UploadFile = File(...), user_id: str = Depends(get_current_user)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    temp_path = None
    try:
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = temp_file.name
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save temporary file: {str(e)}")
        
    try:
        metadata = process_resume(user_id, temp_path, file.filename)
        return {"status": "success", "metadata": metadata}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass


@app.get("/resume-metadata")
def get_resume_metadata_api(user_id: str = Depends(get_current_user)):
    try:
        return get_resume_metadata(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/resume")
def delete_resume_api(user_id: str = Depends(get_current_user)):
    try:
        success = delete_user_resume(user_id)
        return {"status": "success", "deleted": success}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))