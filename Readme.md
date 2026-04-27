# AI Resume Analyzer

A full-stack AI-powered web application that analyzes resumes against job descriptions and provides match scores, missing skills, and improvement suggestions.

## Features
- Resume PDF parsing
- Skill extraction using regex
- Match score using hybrid algorithm:
  - Skill Matching (70%)
  - TF-IDF Cosine Similarity (30%)
- Missing skills detection
- AI-based resume suggestions (OpenAI)
- Recent analysis history (database)
- Interactive charts (React + Chart.js)

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Chart.js

### Backend
- Django
- Django REST Framework
- SQLite

### AI / ML
- OpenAI API
- Scikit-learn (TF-IDF + cosine similarity)

---

## Setup Instructions

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

### Frontend 
...bash
cd frontend
npm install
npm start
