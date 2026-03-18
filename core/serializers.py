from rest_framework import serializers
from .models import User, Project, DailyReport

# 1. User Serializer (To show who is who)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'phone']

# 2. Project Serializer (To show project details)
class ProjectSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.username', read_only=True)
    engineer_name = serializers.CharField(source='site_engineer.username', read_only=True)

    class Meta:
        model = Project
        # ADDED 'client' and 'site_engineer' to this list
        fields = ['id', 'name', 'location', 'client', 'client_name', 'site_engineer', 'engineer_name', 'start_date', 'deadline', 'budget', 'risk_level']

# 3. Daily Report Serializer (To add reports)
class DailyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyReport
        # 👇 ADD 'risk_level' HERE 👇
        fields = ['id', 'project', 'date', 'labor_count', 'weather_condition', 'work_description', 'material_status', 'cost_today', 'delay_hours', 'site_image', 'risk_level']