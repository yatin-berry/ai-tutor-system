from backend.services.db_services import (
    get_all_attempts,
    get_recent_attempts,
    get_all_interviews,
    get_recent_interviews
)


def get_dashboard_data(user_id: str):
    quiz_attempts = get_all_attempts(user_id)
    interview_attempts = get_all_interviews(user_id)

    recent_quiz = get_recent_attempts(user_id)
    recent_interviews = get_recent_interviews(user_id)

    total_quiz = len(quiz_attempts)
    total_interviews = len(interview_attempts)

    # 🔹 QUIZ METRICS
    total_score_sum = sum(item.get("total_score", 0) for item in quiz_attempts)
    accuracy_sum = sum(item.get("accuracy", 0) for item in quiz_attempts)

    avg_accuracy = round(accuracy_sum / total_quiz, 2) if total_quiz else 0

    # 🔹 SUBJECT-WISE STATS
    subject_map = {}
    for item in quiz_attempts:
        subject = item.get("subject", "Unknown")
        if subject not in subject_map:
            subject_map[subject] = {"subject": subject, "attempts": 0, "accuracy_sum": 0}
        subject_map[subject]["attempts"] += 1
        subject_map[subject]["accuracy_sum"] += item.get("accuracy", 0)

    subject_stats = []
    for subject, data in subject_map.items():
        attempts = data["attempts"]
        subject_stats.append({
            "subject": subject,
            "attempts": attempts,
            "average_accuracy": round(data["accuracy_sum"] / attempts, 2)
        })
    subject_stats = sorted(subject_stats, key=lambda x: x["attempts"], reverse=True)

    # 🔹 ROLE-WISE STATS
    role_map = {}
    for item in interview_attempts:
        role = item.get("role", "Unknown")
        if role not in role_map:
            role_map[role] = {"role": role, "attempts": 0, "score_sum": 0}
        role_map[role]["attempts"] += 1
        role_map[role]["score_sum"] += item.get("average_score", 0)

    role_stats = []
    for role, data in role_map.items():
        attempts = data["attempts"]
        role_stats.append({
            "role": role,
            "attempts": attempts,
            "average_score": round(data["score_sum"] / attempts, 2)
        })
    role_stats = sorted(role_stats, key=lambda x: x["attempts"], reverse=True)

    # 🔹 COMBINED RECENT HISTORY
    history = []
    for q in recent_quiz:
        history.append({
            "title": f"{q.get('subject')} Quiz",
            "date": q.get("created_at", "").split("T")[0],
            "score": q.get("accuracy", 0),
            "type": "quiz"
        })
    for i in recent_interviews:
        history.append({
            "title": f"{i.get('role')} Interview",
            "date": i.get("created_at", "").split("T")[0],
            "score": i.get("average_score", 0),
            "type": "interview"
        })
    history = sorted(history, key=lambda x: x["date"], reverse=True)[:10]

    return {
        "total_quizzes": total_quiz,
        "avg_accuracy": avg_accuracy,
        "knowledge_points": int(total_score_sum * 10),
        "total_interviews": total_interviews,
        "recent_history": history,
        "subject_stats": subject_stats,
        "role_stats": role_stats
    }