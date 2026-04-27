from django.db import models

class ResumeAnalysis(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    match_score = models.FloatField()
    skills = models.TextField()
    missing_skills = models.TextField()