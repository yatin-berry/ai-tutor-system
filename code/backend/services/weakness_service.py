from openai import OpenAI
import os
import json
import re
from dotenv import load_dotenv
from backend.prompts.weakness_prompt import build_weakness_prompt

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)


def detect_weakness(results):
    prompt = build_weakness_prompt(results)

    try:
        response = client.chat.completions.create(
            model="deepseek/deepseek-chat",
            messages=[
                {"role": "system", "content": "You are a strict JSON generator for weakness analysis."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500
        )

        content = response.choices[0].message.content
        cleaned = re.sub(r"```json|```", "", content).strip()

        return json.loads(cleaned)

    except Exception as e:
        print("WEAKNESS DETECTION ERROR:", str(e))
        return {
            "weak_areas": [],
            "suggestions": ["Weakness detection failed"]
        }