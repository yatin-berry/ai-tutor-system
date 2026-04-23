from openai import OpenAI
import os
import json
import re
from dotenv import load_dotenv
from backend.prompts.quiz_prompt import build_quiz_prompt
from backend.utils.security import sanitize_input

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)


def extract_json_content(text: str):
    # Remove markdown fences first
    cleaned = re.sub(r"```json|```", "", text).strip()

    # Try to extract JSON array first
    array_match = re.search(r"\[\s*{.*}\s*\]", cleaned, re.DOTALL)
    if array_match:
        return array_match.group(0)

    # Fallback: extract JSON object if needed
    object_match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if object_match:
        return object_match.group(0)

    return cleaned


def generate_quiz(subject, topic, level, num_questions=5):
    content = ""

    try:
        subject = sanitize_input(subject)
        topic = sanitize_input(topic)
        level = sanitize_input(level)

        prompt = build_quiz_prompt(subject, topic, level, num_questions)

        response = client.chat.completions.create(
            model="deepseek/deepseek-chat",
            messages=[
                {"role": "system", "content": "You are a strict JSON quiz generator. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500
        )

        content = response.choices[0].message.content

        extracted_json = extract_json_content(content)
        parsed = json.loads(extracted_json)

        return {
            "status": "success",
            "data": parsed
        }

    except json.JSONDecodeError:
        return {
            "status": "error",
            "message": "Invalid JSON from AI",
            "raw": content
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }