from openai import OpenAI
import os
import json
import re
import uuid
from dotenv import load_dotenv

from backend.prompts.interview_prompt import build_interview_question_prompt
from backend.prompts.interview_summary_prompt import build_interview_summary_prompt
from backend.services.evaluation_service import evaluate_with_ai
from backend.services.db_services import save_interview_attempt

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

# in-memory session store for now
interview_sessions = {}


def _extract_json_content(text: str):
    cleaned = re.sub(r"```json|```", "", text).strip()

    object_match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if object_match:
        return object_match.group(0)

    return cleaned


def generate_interview_question(role, level, previous_questions=None):
    prompt = build_interview_question_prompt(role, level, previous_questions)

    response = client.chat.completions.create(
        model="deepseek/deepseek-chat",
        messages=[
            {
                "role": "system",
                "content": "You are a strict JSON interview question generator."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        max_tokens=1500
    )

    content = response.choices[0].message.content
    extracted = _extract_json_content(content)
    parsed = json.loads(extracted)

    return parsed["question"]


def start_interview(role, level, user_id, total_questions=3):
    session_id = str(uuid.uuid4())

    first_question = generate_interview_question(role, level, [])

    interview_sessions[session_id] = {
        "user_id": user_id,
        "role": role,
        "level": level,
        "total_questions": total_questions,
        "current_index": 0,
        "questions": [first_question],
        "results": []
    }

    return {
        "status": "success",
        "session_id": session_id,
        "question_number": 1,
        "question": first_question,
        "is_completed": False
    }


def submit_interview_answer(session_id, answer):
    if session_id not in interview_sessions:
        return {
            "status": "error",
            "message": "Invalid interview session"
        }

    session = interview_sessions[session_id]
    current_question = session["questions"][session["current_index"]]

    # AI-based evaluation
    eval_result = evaluate_with_ai(
        current_question,
        "A strong role-appropriate answer covering the key concept clearly.",
        answer
    )

    score = eval_result.get("score", 0)
    feedback = eval_result.get("feedback", "No feedback")

    session["results"].append({
        "question": current_question,
        "user_answer": answer,
        "score": score,
        "feedback": feedback
    })

    session["current_index"] += 1

    # if completed
    if session["current_index"] >= session["total_questions"]:
        summary = generate_interview_summary(
            session["role"],
            session["results"]
        )

        total_score = sum(item.get("score", 0) for item in session["results"])
        average_score = round(total_score / len(session["results"]), 2) if session["results"] else 0

        interview_data = {
            "user_id": session["user_id"],
            "role": session["role"],
            "level": session["level"],
            "questions": session["questions"],
            "answers": [item.get("user_answer") for item in session["results"]],
            "results": session["results"],
            "total_score": total_score,
            "average_score": average_score,
            "summary": summary.get("summary", ""),
            "strengths": summary.get("strengths", []),
            "weaknesses": summary.get("weaknesses", []),
            "suggestions": summary.get("suggestions", [])
        }

        try:
            save_interview_attempt(interview_data)
        except Exception as e:
            print("INTERVIEW DB SAVE ERROR:", str(e))

        return {
            "status": "success",
            "is_completed": True,
            "results": session["results"],
            "final_summary": summary,
            "total_score": total_score,
            "average_score": average_score
        }

    # else next question
    next_question = generate_interview_question(
        session["role"],
        session["level"],
        session["questions"]
    )

    session["questions"].append(next_question)

    return {
        "status": "success",
        "is_completed": False,
        "question_number": session["current_index"] + 1,
        "question": next_question,
        "last_feedback": feedback,
        "last_score": score
    }


def generate_interview_summary(role, results):
    prompt = build_interview_summary_prompt(results, role)

    response = client.chat.completions.create(
        model="deepseek/deepseek-chat",
        messages=[
            {
                "role": "system",
                "content": "You are a strict JSON interview analyst."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        max_tokens=1500
    )

    content = response.choices[0].message.content
    extracted = _extract_json_content(content)
    return json.loads(extracted)