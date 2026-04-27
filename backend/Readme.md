# AI Resume Analyzer 🚀

A full-stack AI-powered resume analysis tool that compares resumes with job descriptions and provides match score, missing skills, and improvement suggestions.

## Features
- Resume upload (PDF)
- Skill extraction
- Match score (TF-IDF + skill matching)
- Missing skills detection
- AI suggestions (OpenAI)
- History tracking

## Tech Stack
- Frontend: React.js
- Backend: Django REST Framework
- AI: OpenAI API
- ML: TF-IDF, Cosine Similarity

## How to Run

### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py runserver