from django.urls import path
from . import views

urlpatterns = [
    path('questions/', views.get_questions_view, name='get_questions'),
    path('evaluate/', views.evaluate_view, name='evaluate_questionnaire'),
    path('track/', views.track_interaction_view, name='track_interaction'),
    path('profiles/', views.list_profiles_view, name='list_profiles'),
    path('analytics/', views.get_analytics_view, name='get_analytics'),
]
