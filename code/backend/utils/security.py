def sanitize_input(text: str) -> str:
    if not text:
        return ""

    blocked_phrases = [
        "ignore previous instructions",
        "reveal system prompt",
        "bypass",
        "override",
        "system prompt",
        "act as",
        "jailbreak"
    ]

    text_lower = text.lower()

    for phrase in blocked_phrases:
        if phrase in text_lower:
            raise ValueError("Potential prompt injection detected")

    return text.strip()