from dotenv import load_dotenv
import os
from google import genai
from groq import Groq
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
Analyze this resume and provide:

1. ATS score out of 100
2. Technical strengths
3. Missing skills
4. Resume weaknesses
5. Suggested improvements
6. Suitable job roles

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

        return response.text

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

        return response.choices[0].message.content