
def build_interview_question_prompt(role, level, previous_questions=None, resume_context=None, chat_history=None):
    previous_questions = previous_questions or []
    
    resume_section = ""
    if resume_context:
        resume_section = f"""
CANDIDATE RESUME CONTEXT (Extracted from candidate's resume):
{resume_context}

INSTRUCTION: Prioritize asking questions about the projects, skills, tools, and experiences listed in the candidate's resume context that are relevant to the role. Ensure you ask about specific technologies they claim to have worked with. Never invent or assume any resume details not present in this context.
"""
    
    chat_history_section = ""
    if chat_history:
        chat_history_section = f"""
PREVIOUS CONVERSATION HISTORY (Build on or follow up from this naturally):
{chat_history}
"""

    return f"""
You are an expert technical interviewer at a top-tier tech company.

TASK:
Generate exactly 1 high-quality interview question for the given role and difficulty level.

ROLE:
{role}

DIFFICULTY LEVEL:
{level}

{resume_section}
{chat_history_section}

PREVIOUS QUESTIONS (Do NOT repeat or overlap with these):
{previous_questions}

STRICT SPECIFICITY RULES:
1. Deep Role & Resume Inquiries: If a resume is provided, focus on the candidate's actual projects, libraries, databases, frameworks, or system designs mentioned. Ask project-specific, technology-specific, or experience-based questions.
2. If no resume context is provided, generate role-based questions only.
3. If role is 'AI Engineer': Focus on LLMs, RAG, Prompt Engineering, Vector DBs, Fine-tuning, and Agentic workflows.
4. If role is 'ML Engineer': Focus on Model Training, Feature Engineering, Deployment (MLOps), and Traditional ML Algorithms.
5. If role is 'Data Scientist': Focus on Statistics, Data Analysis, Experimentation, and Insights.
6. Tailor the scenario to the specific role's day-to-day responsibilities.

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