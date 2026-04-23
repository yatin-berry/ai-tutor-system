from openai import OpenAI
import os
import json
import re
from dotenv import load_dotenv
from backend.prompts.eval_prompt import build_evaluation_prompt

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)
def evaluate_with_ai(question, correct_answer, user_answer):

    prompt = build_evaluation_prompt(question, correct_answer, user_answer)

    try:
        response = client.chat.completions.create(
            model="deepseek/deepseek-chat",
            messages=[
                {"role": "system", "content": "You are a strict evaluator."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500
        )

        content = response.choices[0].message.content

        cleaned = re.sub(r"```json|```", "", content).strip()

        return json.loads(cleaned)

    except Exception as e:
        print("AI EVALUATION ERROR:", str(e))

        return {
            "score": 0,
            "feedback": "AI evaluation failed"
        }

def evaluate_answers(questions, user_answers):
    results = []
    total_score = 0

    for i, q in enumerate(questions):
        user_ans = user_answers[i]
        correct_ans = q["correct_answer"]
        explanation = q.get("explanation", "No explanation available")
        q_type = q.get("type")

        if q_type in ["mcq", "true_false", "fill"]:
            is_correct = user_ans.strip().lower() == correct_ans.strip().lower()
            score = 1 if is_correct else 0

            if is_correct:
                feedback = "Correct."
            else:
                feedback = f"Incorrect. Correct answer: {correct_ans}."

        else:
            ai_result = evaluate_with_ai(
                q["question"],
                correct_ans,
                user_ans
            )
            score = ai_result.get("score", 0)
            feedback = ai_result.get("feedback", "No feedback")

        total_score += score

        results.append({
            "question": q["question"],
            "user_answer": user_ans,
            "correct_answer": correct_ans,
            "score": score,
            "feedback": feedback,
            "explanation": explanation,
            "type": q_type
        })

    return {
        "total_score": total_score,
        "results": results
    }