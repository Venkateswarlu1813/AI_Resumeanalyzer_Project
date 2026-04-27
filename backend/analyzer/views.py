from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt

from .utils import (
    extract_skills,
    calculate_match,
    get_missing_skills,
    generate_suggestions
)

from .models import ResumeAnalysis
import pdfplumber

@api_view(['GET'])
def test_api(request):
    return Response({"message": "Working"})

@csrf_exempt
@api_view(['POST'])
def upload_resume(request):
    file = request.FILES.get('resume')
    job_desc = request.data.get('job_description')

    if not file:
        return Response({"error": "No file uploaded"}, status=400)

    if not job_desc:
        return Response({"error": "Job description required"}, status=400)

    text = ""

    try:
        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
    except:
        return Response({"error": "Error reading PDF"}, status=500)

    skills = extract_skills(text)
    score = calculate_match(text, job_desc, skills)
    missing_skills = get_missing_skills(skills, job_desc)
    suggestions = generate_suggestions(text, job_desc, missing_skills)

    ResumeAnalysis.objects.create(
        match_score=score,
        skills=", ".join(skills),
        missing_skills=", ".join(missing_skills)
    )

    return Response({
        "status": "success",
        "message": "Resume analyzed successfully",
        "data": {
            "match_score": score,
            "skills": skills,
            "missing_skills": missing_skills,
            "suggestions": suggestions
        }
    }, status=200)


@api_view(['GET'])
def get_history(request):
    data = ResumeAnalysis.objects.all().order_by('-created_at')[:5]

    result = []
    for item in data:
        result.append({
            "score": item.match_score,
            "skills": item.skills,
            "missing": item.missing_skills,
            "date": item.created_at
        })

    return Response(result)