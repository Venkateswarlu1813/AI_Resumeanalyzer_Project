import os
import re
from dotenv import load_dotenv
from openai import OpenAI
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

SKILLS = [
    "python", "java", "c", "c++", "javascript",
    "react", "django", "html", "css",
    "sql", "mongodb", "machine learning",
    "deep learning", "tensorflow", "keras",
    "aws", "node"
]

def extract_skills(text):
    text = text.lower()
    found_skills = []

    for skill in SKILLS:
        if re.search(r'\b' + re.escape(skill) + r'\b', text):
            found_skills.append(skill)

    return list(set(found_skills))

def skill_match_score(resume_skills, job_desc):
    job_desc = job_desc.lower()

    required_skills = []

    for skill in SKILLS:
        if re.search(r'\b' + re.escape(skill) + r'\b', job_desc):
            required_skills.append(skill) 

    if len(required_skills) == 0:
        return 0, required_skills

    matched = len(set(required_skills) & set(resume_skills))
    score = (matched / len(required_skills)) * 100

    return round(score, 2), required_skills

def text_similarity_score(resume_text, job_desc):
    tfidf = TfidfVectorizer(stop_words='english')
    vectors = tfidf.fit_transform([resume_text, job_desc])

    score = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    return round(score * 100, 2)

def calculate_match(resume_text, job_desc, resume_skills):
    job_desc = job_desc.lower()

    required_skills = []
    for skill in SKILLS:
        if re.search(r'\b' + re.escape(skill) + r'\b', job_desc):
            required_skills.append(skill)

    if len(required_skills) == 0:
        skill_score = 0
    else:
        matched = sum(1 for skill in required_skills if skill in resume_skills)
        skill_score = (matched / len(required_skills)) * 100

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([resume_text, job_desc])
    similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]

    text_score = similarity * 100

    final_score = (skill_score * 0.7) + (text_score * 0.3)

    return round(final_score, 2)

def get_missing_skills(resume_skills, job_desc):
    job_desc = job_desc.lower()

    required_skills = []
    for skill in SKILLS:
        if re.search(r'\b' + re.escape(skill) + r'\b', job_desc):
            required_skills.append(skill)

    missing = []
    for skill in required_skills:
        if skill not in resume_skills:
            missing.append(skill)

    return list(set(missing))

def generate_suggestions(resume_text, job_desc, missing_skills):
    try:
        prompt = f"""
        Analyze resume and job description.

        Resume:
        {resume_text}

        Job:
        {job_desc}

        Missing Skills:
        {missing_skills}

        Give 5 short improvement suggestions.
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )

        suggestions = response.choices[0].message.content.split("\n")
        return [s for s in suggestions if s.strip() != ""]

    except:
        fallback = [f"Consider learning {skill}" for skill in missing_skills]
        fallback.append("Add more projects related to the job role")
        fallback.append("Improve resume formatting and keywords")
        return fallback