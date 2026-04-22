from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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