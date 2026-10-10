from dotenv import load_dotenv
from google import genai
from groq import Groq

import json
import logging
import os

load_dotenv()

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize provider clients
client = genai.Client(
    api_key=GEMINI_API_KEY
)

client2 = Groq(
    api_key=GROQ_API_KEY
)

GEMINI_MODEL = "gemini-3.8-flash"
GROQ_MODEL = "openai/gpt-oss-20b"


prompt_template = """
Analyze the resume.

Return ONLY valid JSON.

Example format:

{{
  "ats_score": 82,
  "strengths": [
    "Python",
    "Docker",
    "Azure"
  ],
  "missing_skills": [
    "Kubernetes",
    "Redis"
  ],
  "weaknesses": [
    "Limited frontend experience"
  ],
  "improvements": [
    "Add Kubernetes projects"
  ],
  "roles": [
    "DevOps Engineer",
    "Cloud Engineer"
  ]
}}

Rules:
- Return valid JSON only
- No markdown
- No explanation outside JSON
- No code blocks
- Do not invent skills or experience absent from the resume
- Base recommendations on evidence in the resume
- ats_score must be a number between 0 and 100

Resume:
{resume_text}
"""


def parse_analysis(response_text: str) -> dict:
    """
    Parse and validate the basic structure of the AI response.
    """

    if not response_text:
        raise ValueError("The AI provider returned an empty response.")

    response_text = response_text.strip()

    # Handle responses wrapped in a Markdown code block.
    if response_text.startswith("```"):
        lines = response_text.splitlines()

        if lines and lines[0].startswith("```"):
            lines = lines[1:]

        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]

        response_text = "\n".join(lines).strip()

    result = json.loads(response_text)

    if not isinstance(result, dict):
        raise ValueError("AI response must be a JSON object.")

    required_fields = {
        "ats_score",
        "strengths",
        "missing_skills",
        "weaknesses",
        "improvements",
        "roles",
    }

    missing_fields = required_fields - result.keys()

    if missing_fields:
        raise ValueError(
            f"AI response is missing fields: {sorted(missing_fields)}"
        )

    score = result["ats_score"]

    if (
        isinstance(score, bool)
        or not isinstance(score, (int, float))
        or not 0 <= score <= 100
    ):
        raise ValueError("ats_score must be a number between 0 and 100.")

    list_fields = [
        "strengths",
        "missing_skills",
        "weaknesses",
        "improvements",
        "roles",
    ]

    for field in list_fields:
        if not isinstance(result[field], list):
            raise ValueError(f"{field} must be a JSON array.")

    return result


def generate_response(resume_text: str) -> dict:
    """
    Generate resume analysis using Gemini, with Groq as a fallback.

    Returns:
        dict: Validated resume analysis.

    Raises:
        RuntimeError: If both providers fail.
    """

    prompt = prompt_template.format(
        resume_text=resume_text
    )

    # Attempt 1: Gemini
    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )

        return parse_analysis(response.text)

    except Exception:
        logger.exception(
            "Gemini analysis failed. Attempting Groq fallback."
        )

    # Attempt 2: Groq
    try:
        response = client2.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            response_format={
                "type": "json_object"
            },
        )

        content = response.choices[0].message.content

        return parse_analysis(content)

    except Exception as exc:
        logger.exception("Groq fallback analysis failed.")

        raise RuntimeError(
            "Resume analysis failed: all AI providers are unavailable "
            "or returned invalid responses."
        ) from exc