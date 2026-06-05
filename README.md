# AI Resume Analyzer

A full-stack AI-powered Resume Analyzer that helps users upload resumes, extract content from PDF files, identify technical skills, and receive AI-generated resume feedback.

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes

### Resume Management

* Upload PDF Resume
* Extract Resume Text
* View Resume History
* Resume Detail View
* Delete Resume

### AI Analysis

* ATS Score Estimation
* Technical Strength Analysis
* Missing Skills Detection
* Resume Weakness Identification
* Improvement Suggestions
* Recommended Job Roles

### AI Failover Architecture

* Primary Provider: Google Gemini
* Fallback Provider: Groq (Llama 3.1)
* Ensures resume analysis remains available when the primary provider is unavailable

---

## Tech Stack

### Backend

* FastAPI
* SQLAlchemy
* PostgreSQL
* JWT Authentication
* pdfplumber

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router

### AI

* Google Gemini
* Groq LLM

---

## Architecture

User
↓
React Frontend
↓
FastAPI Backend
↓
PostgreSQL

AI Layer
├── Gemini
└── Groq Fallback

---

## Project Structure

resume_analyzer/

├── app/
│ ├── ai/
│ ├── auth/
│ ├── db/
│ ├── models/
│ ├── resume/
│ └── main.py
│
├── frontend/
│ ├── src/
│ ├── public/
│ └── package.json
│
├── uploads/
├── requirements.txt
├── .env
└── README.md

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd resume_analyzer
```

### Backend Setup

```bash
python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt
```

### Environment Variables

Create a .env file:

```env
DATABASE_URL=your_database_url

SECRET_KEY=your_secret_key

GEMINI_API_KEY=your_gemini_api_key

GROQ_API_KEY=your_groq_api_key
```

### Start Backend

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Future Improvements

* Docker Containerization
* Redis Caching
* AWS S3 Resume Storage
* CI/CD Pipeline
* Kubernetes Deployment
* Resume Versioning
* Advanced ATS Scoring
* Multi-LLM Routing
* Monitoring & Observability

---

## Learning Outcomes

This project demonstrates:

* REST API Development
* Authentication & Authorization
* Database Design
* PDF Processing
* AI Integration
* Multi-Provider AI Failover
* React Frontend Development
* Full-Stack Application Architecture

---

## Author

Dhanush

MCA Student | Backend Engineering | Cloud | DevOps | AI Applications
