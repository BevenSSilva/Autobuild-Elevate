from django.urls import path
from . import views

urlpatterns = [
    path('projects/', views.project_list, name='project-list'),
    path('reports/add/', views.add_report, name='add-report'),
    path('stats/', views.project_stats, name='project-stats'),
    
    # --- ADD THESE TWO LINES ---
    path('projects/<int:pk>/', views.project_detail, name='project-detail'),
    path('projects/<int:pk>/reports/', views.project_reports, name='project-reports'),
    # Add these to your urlpatterns list in core/urls.py
    path('users/', views.get_users, name='get-users'),
    path('projects/add/', views.add_project, name='add-project'),
]