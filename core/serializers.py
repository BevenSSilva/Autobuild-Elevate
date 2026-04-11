from rest_framework import serializers
from .models import User, Project, DailyReport

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'phone']

class ProjectSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.username', read_only=True)
    engineer_name = serializers.CharField(source='site_engineer.username', read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'location', 'client', 'client_name', 'site_engineer', 
            'engineer_name', 'start_date', 'deadline', 'budget', 'risk_level', 
            'status', 'last_action_by'
        ]

class DailyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyReport
        fields = [
            'id', 'project', 'date', 'labor_count', 'weather_condition', 
            'work_description', 'material_status', 'cost_today', 
            'delay_hours', 'site_image', 'risk_level'
        ]