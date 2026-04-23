
def build_interview_question_prompt(role, level, previous_questions=None):
    previous_questions = previous_questions or []

    return f"""
You are an expert technical interviewer at a top-tier tech company.

TASK:
Generate exactly 1 high-quality interview question for the given role and difficulty level.

ROLE:
{role}

DIFFICULTY LEVEL:
{level}

PREVIOUS QUESTIONS (Do NOT repeat or overlap with these):
{previous_questions}

STRICT SPECIFICITY RULES:
1. Deep Role Analysis: Do NOT give generic Machine Learning questions (like 'Explain Bias-Variance tradeoff') unless the role is generic.
2. If role is 'AI Engineer': Focus on LLMs, RAG, Prompt Engineering, Vector DBs, Fine-tuning, and Agentic workflows.
3. If role is 'ML Engineer': Focus on Model Training, Feature Engineering, Deployment (MLOps), and Traditional ML Algorithms.
4. If role is 'Data Scientist': Focus on Statistics, Data Analysis, Experimentation, and Insights.
5. Tailor the scenario to the specific role's day-to-day responsibilities.

DIFFICULTY GUIDELINES:
- Beginner: Focus on core concepts, terminology, and basic implementation.
- Intermediate: Focus on real-world application, debugging, and small-scale architecture scenarios.
- Advanced: Focus on system-level tradeoffs, optimization, scalability, and cutting-edge research implications.

OUTPUT RULES:
- Output ONLY valid JSON
- No markdown formatting
- No extra text

OUTPUT FORMAT:
{{
  "question": "string"
}}
"""