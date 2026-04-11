from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token  
from .models import User, Project, DailyReport
from .serializers import UserSerializer, ProjectSerializer, DailyReportSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_list(request):
    user = request.user
    role = str(user.role).upper() 
    if role in ['ADMIN', 'SITE_ENGINEER']:
        projects = Project.objects.all()
    elif role == 'CLIENT':
        projects = Project.objects.filter(client=user)
    else:
        return Response(status=status.HTTP_403_FORBIDDEN)
    return Response(ProjectSerializer(projects, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_stats(request):
    user = request.user
    role = str(user.role).upper()
    base_query = Project.objects.all() if role in ['ADMIN', 'SITE_ENGINEER'] else Project.objects.filter(client=user)
    return Response({'total': base_query.count(), 'high_risk': base_query.filter(risk_level='High Risk').count()})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def call_off_work(request, pk):
    try:
        project = Project.objects.get(pk=pk)
        role = str(request.user.role).upper()
        if role != 'ADMIN' and project.client != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        project.status = "Halted"
        project.last_action_by = role 
        project.save()
        return Response({'message': 'Halted'})
    except Project.DoesNotExist: return Response(status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resume_work(request, pk):
    try:
        project = Project.objects.get(pk=pk)
        role = str(request.user.role).upper()
        if role != 'ADMIN' and project.client != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        project.status = "Active"
        project.last_action_by = role 
        project.save()
        return Response({'message': 'Resumed'})
    except Project.DoesNotExist: return Response(status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_report(request):
    project_id = request.data.get('project')
    try:
        project = Project.objects.get(pk=project_id)
        if project.status == "Halted":
            return Response({"error": "Site is halted. Cannot upload reports."}, status=status.HTTP_400_BAD_REQUEST)
    except Project.DoesNotExist: return Response(status=404)

    serializer = DailyReportSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save() 
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_detail(request, pk):
    return Response(ProjectSerializer(Project.objects.get(pk=pk)).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_reports(request, pk):
    return Response(DailyReportSerializer(DailyReport.objects.filter(project_id=pk).order_by('-id'), many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    if str(request.user.role).upper() != 'ADMIN':
        return Response(status=status.HTTP_403_FORBIDDEN)
    return Response(UserSerializer(User.objects.all(), many=True).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_project(request):
    if str(request.user.role).upper() != 'ADMIN':
        return Response(status=status.HTTP_403_FORBIDDEN)
    serializer = ProjectSerializer(data=request.data)
    if serializer.is_valid(): 
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_user(request):
    username, password = request.data.get('username'), request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'id': user.id, 'username': user.username, 'role': user.role, 'token': token.key})
    return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)