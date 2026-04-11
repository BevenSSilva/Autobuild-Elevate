from django.db import models
from django.contrib.auth.models import AbstractUser
from decimal import Decimal

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('SITE_ENGINEER', 'Site Engineer'),
        ('CLIENT', 'Client'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='ADMIN')
    phone = models.CharField(max_length=15, blank=True)

class Project(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client_projects', limit_choices_to={'role': 'CLIENT'})
    site_engineer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='site_projects', limit_choices_to={'role': 'SITE_ENGINEER'})
    start_date = models.DateField()
    deadline = models.DateField()
    
    status = models.CharField(max_length=20, default="Active")
    last_action_by = models.CharField(max_length=20, blank=True, null=True) 
    
    budget = models.DecimalField(max_digits=12, decimal_places=2)
    risk_level = models.CharField(max_length=20, default="Pending")

    def __str__(self):
        return f"{self.name} (Status: {self.status})"

class DailyReport(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    labor_count = models.IntegerField()
    weather_condition = models.CharField(max_length=50) 
    work_description = models.TextField()
    site_image = models.ImageField(upload_to='site_reports/', blank=True, null=True)
    delay_hours = models.IntegerField(default=0)
    material_status = models.CharField(max_length=20, default='SUFFICIENT')
    cost_today = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    risk_level = models.CharField(max_length=20, default='Assessed')

    def save(self, *args, **kwargs):
        from .ml_model import RiskPredictor
        ai_engine = RiskPredictor()
        
        if not self.pk:
            self.project.budget -= self.cost_today
            self.project.save()
        
        weather_map = {'Clear': 10, 'Sunny': 10, 'Cloudy': 8, 'Rain': 4, 'Storm': 1}
        w_score = weather_map.get(self.weather_condition.title(), 5) 
        m_score = {'SUFFICIENT': 100, 'LOW': 50, 'CRITICAL': 10}.get(self.material_status, 80)
        
        self.risk_level = ai_engine.predict_risk(self.labor_count, w_score, m_score)
        self.project.risk_level = self.risk_level
        self.project.save()
        super().save(*args, **kwargs)