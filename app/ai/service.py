from dotenv import load_dotenv
import os
from google import genai
from groq import Groq
import json
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# create client
client = genai.Client(
    api_key=GEMINI_API_KEY
)
client2= Groq(
    api_key=GROQ_API_KEY    
)
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

Resume:
{resume_text}
"""


def generate_response(resume_text):

    prompt = prompt_template.format(
        resume_text=resume_text
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        print(response.text)
        return json.loads(response.text)
        
    except Exception as e:

        print(f"Gemini failed: {e}")

        response = client2.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        print(response.choices[0].message.content)
        return json.loads(response.choices[0].message.content)
