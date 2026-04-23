from backend.services.evaluation_service import evaluate_answers
from backend.services.weakness_service import detect_weakness
from backend.services.db_services import save_quiz_attempt


def submit_quiz(subject, topic, level, questions, answers, user_id):

    if len(questions) != len(answers):
        return {
            "status": "error",
            "message": "Number of questions and answers do not match"
        }

    if not questions:
        return {
            "status": "error",
            "message": "No questions provided"
        }

    result = evaluate_answers(questions, answers)
    weakness_result = detect_weakness(result["results"])

    total_questions = len(questions)
    total_score = result["total_score"]
    accuracy = round((total_score / total_questions) * 100, 2)

    # save in DB
    attempt_data = {
        "user_id": user_id,
        "subject": subject,
        "topic": topic,
        "level": level,
        "questions": questions,
        "answers": answers,
        "total_score": total_score,
        "accuracy": accuracy,
        "weak_areas": weakness_result.get("weak_areas", []),
        "suggestions": weakness_result.get("suggestions", [])
    }

    try:
        save_quiz_attempt(attempt_data)
    except Exception as e:
        print("DB SAVE ERROR:", str(e))

    return {
        "status": "success",
        "total_questions": total_questions,
        "total_score": total_score,
        "accuracy": accuracy,
        "summary": f"You scored {total_score} out of {total_questions}.",
        "results": result["results"],
        "weak_areas": weakness_result.get("weak_areas", []),
        "suggestions": weakness_result.get("suggestions", [])
    }