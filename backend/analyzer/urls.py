from django.urls import path
from .views import upload_resume, test_api, get_history

urlpatterns = [
    path('upload/', upload_resume),
    path('test/', test_api),
    path('history/', get_history),
]