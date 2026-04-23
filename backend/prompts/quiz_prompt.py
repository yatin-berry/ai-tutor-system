
def build_quiz_prompt(subject, topic, level, num_questions=5):
    return f"""
You are an expert AI Quiz Generator.

YOUR TASK:
Generate exactly {num_questions} quiz questions for the given subject, topic, and difficulty level.
 
STRICT RULES:
- Output ONLY valid JSON
- Do NOT include markdown
- Do NOT include code fences
- Do NOT include any text before or after JSON
- Stay strictly within the given subject and topic
- Questions must be educational and concept-focused
- Avoid repeated questions
- Keep language clear and student-friendly

DIFFICULTY LEVEL DEFINITIONS:
- Beginner:
  * Basic definitions
  * Direct concept understanding
  * Very simple and clear wording
  * Minimal trickiness

- Intermediate:
  * Application-based questions
  * Scenario-based understanding
  * Requires concept usage, not just memorization

- Advanced:
  * Analytical questions
  * Multi-step reasoning
  * Deeper conceptual understanding
  * Compare related ideas where relevant

QUESTION TYPE RULES:
- mcq:
  * Must have exactly 4 options
  * Only 1 correct answer
- true_false:
  * Options must be ["True", "False"]
- fill:
  * Options must be []
  * Correct answer must be short and exact
- open:
  * Options must be []
  * Correct answer must be a concise model answer

DISTRIBUTION:
You MUST generate a mix of all four question types: mcq, true_false, fill, open.
If num_questions >= 4, you MUST include at least one question of EVERY type.

OUTPUT FORMAT:
[
  {{
    "question": "string",
    "options": ["string"],
    "correct_answer": "string",
    "explanation": "string",
    "type": "mcq"
  }}
]

IMPORTANT:
- Every object must include:
  "question", "options", "correct_answer", "explanation", "type"
- Explanation must clearly teach the concept in 1-3 lines
- For fill and open questions, options must be []
- Ensure the output is valid JSON

INPUT:
Subject: {subject}
Topic: {topic}
Level: {level}
"""