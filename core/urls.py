from django.urls import path
from . import views

urlpatterns = [
    path('projects/', views.project_list, name='project-list'),
    path('reports/add/', views.add_report, name='add-report'),
    path('stats/', views.project_stats, name='project-stats'),
    
    # --- ADD THESE TWO LINES ---
    path('projects/<int:pk>/', views.project_detail, name='project-detail'),
    path('projects/<int:pk>/reports/', views.project_reports, name='project-reports'),
path('projects/<int:pk>/call-off/', views.call_off_work, name='call-off-work'),
    path('projects/<int:pk>/resume/', views.resume_work, name='resume-work'),

    # Add these to your urlpatterns list in core/urls.py
    path('users/', views.get_users, name='get-users'),
    path('projects/add/', views.add_project, name='add-project'),
    path('login/', views.login_user, name='login'),
    path('projects/<int:pk>/call-off/', views.call_off_work, name='call-off-work'),
]