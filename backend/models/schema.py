from pydantic import BaseModel
from typing import List, Optional


class UserSignUp(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str


class QuizRequest(BaseModel):
    subject: str
    topic: str
    level: str
    num_questions: int = 5


class Question(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
    type: str
    explanation: str


class SubmitQuizRequest(BaseModel):
    subject: str
    topic: str
    level: str
    questions: List[Question]
    answers: List[str]

class InterviewStartRequest(BaseModel):
    role: str
    level: str
    total_questions: int = 3


class InterviewAnswerRequest(BaseModel):
    session_id: str
    answer: str