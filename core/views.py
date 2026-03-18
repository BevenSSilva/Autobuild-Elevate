from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User, Project, DailyReport
from .serializers import UserSerializer, ProjectSerializer, DailyReportSerializer

# 1. Get All Projects (For the Dashboard)
@api_view(['GET'])
def project_list(request):
    projects = Project.objects.all()
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)

# 2. Add a New Report (The Button)
@api_view(['POST'])
def add_report(request):
    serializer = DailyReportSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()  # This triggers the AI & Budget Logic in models.py automatically!
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 3. Get Project Stats (Optional but cool for dashboard)
@api_view(['GET'])
def project_stats(request):
    total_projects = Project.objects.count()
    high_risk_projects = Project.objects.filter(risk_level='High Risk').count()
    return Response({
        'total': total_projects,
        'high_risk': high_risk_projects
    })
# ... (keep your existing code above) ...

# 4. Get a Single Project's Details
@api_view(['GET'])
def project_detail(request, pk):
    try:
        project = Project.objects.get(pk=pk)
        serializer = ProjectSerializer(project)
        return Response(serializer.data)
    except Project.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

# 5. Get All Reports for a Specific Project
@api_view(['GET'])
def project_reports(request, pk):
    # Fetch reports ordered by newest first
    reports = DailyReport.objects.filter(project_id=pk).order_by('-id')
    serializer = DailyReportSerializer(reports, many=True)
    return Response(serializer.data)
@api_view(['GET'])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

# 7. Create a New Project
@api_view(['POST'])
def add_project(request):
    serializer = ProjectSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)