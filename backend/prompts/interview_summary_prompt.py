
def build_interview_summary_prompt(results, role):
    return f"""
You are an expert interview analyst.

TASK:
Analyze the candidate's interview performance for the given role and provide:
1. strengths
2. weaknesses
3. improvement suggestions
4. overall summary

ROLE:
{role}

INTERVIEW RESULTS:
{results}

RULES:
- Base your analysis only on the provided answers and evaluations
- Be concise and useful
- Focus on interview readiness
- Output ONLY valid JSON
- No markdown
- No extra text

OUTPUT FORMAT:
{{
  "summary": "string",
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "suggestions": ["string", "string"]
}}
"""