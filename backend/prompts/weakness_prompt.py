
def build_weakness_prompt(results):
    return f"""
You are an expert AI learning analyst.

TASK:
Analyze the quiz evaluation results and identify:
1. Weak concepts or learning gaps
2. Practical suggestions for improvement

ANALYSIS RULES:
- Focus mainly on answers with score 0 or 0.5
- Identify concept-level weaknesses, not generic statements
- Use the question, user answer, correct answer, feedback, and explanation
- If performance is strong, still mention minor improvement areas
- Keep insights concise, useful, and student-friendly

OUTPUT RULES:
- Output ONLY valid JSON
- No markdown
- No extra text
- weak_areas should be short concept names
- suggestions should be actionable learning suggestions

OUTPUT FORMAT:
{{
  "weak_areas": ["string", "string"],
  "suggestions": ["string", "string"]
}}

QUIZ RESULTS:
{results}
"""