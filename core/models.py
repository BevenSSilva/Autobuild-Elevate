from django.db import models
from django.contrib.auth.models import AbstractUser
from decimal import Decimal # Needed for money math

# 1. Custom User Model
class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('SITE_ENGINEER', 'Site Engineer'),
        ('STORE_MANAGER', 'Store Manager'),
        ('CLIENT', 'Client'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='ADMIN')
    phone = models.CharField(max_length=15, blank=True)

# 2. Project Model
class Project(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client_projects', limit_choices_to={'role': 'CLIENT'})
    site_engineer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='site_projects', limit_choices_to={'role': 'SITE_ENGINEER'})
    start_date = models.DateField()
    deadline = models.DateField()
    
    # This acts as the "Remaining Budget"
    budget = models.DecimalField(max_digits=12, decimal_places=2)
    risk_level = models.CharField(max_length=20, default="Low")

    def __str__(self):
        return f"{self.name} (Budget Left: {self.budget})"

# 3. Daily Report Model
class DailyReport(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    labor_count = models.IntegerField()
    weather_condition = models.CharField(max_length=50) 
    work_description = models.TextField()
    delay_hours = models.IntegerField(default=0)
    
    # --- NEW FIELDS ---
    MATERIAL_CHOICES = (
        ('SUFFICIENT', 'Sufficient (100%)'),
        ('LOW', 'Running Low (50%)'),
        ('CRITICAL', 'Critical Shortage (10%)'),
    )
    material_status = models.CharField(max_length=20, choices=MATERIAL_CHOICES, default='SUFFICIENT')
    
    # Money Spent Today
    cost_today = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    site_image = models.ImageField(upload_to='site_reports/', blank=True, null=True)

    # 👇 ADDED: Store the AI's risk assessment for THIS specific day
    risk_level = models.CharField(max_length=20, default='Assessed')

    def save(self, *args, **kwargs):
        from .ml_model import RiskPredictor
        ai_engine = RiskPredictor()

        # --- FINANCIAL LOGIC ---
        if not self.pk:
            self.project.budget -= self.cost_today
            self.project.save()
            print(f"--- FINANCE: Subtracted {self.cost_today} from Project Budget. Remaining: {self.project.budget} ---")

        # --- AI LOGIC ---
        clean_weather = self.weather_condition.title() 
        weather_map = {'Clear': 10, 'Sunny': 10, 'Cloudy': 8, 'Rain': 4, 'Storm': 1}
        weather_score = weather_map.get(clean_weather, 5) 
        
        material_map = {'SUFFICIENT': 100, 'LOW': 50, 'CRITICAL': 10}
        material_score = material_map.get(self.material_status, 80)

        predicted_risk = ai_engine.predict_risk(self.labor_count, weather_score, material_score)
        
        # 1. Update the overall Project Risk
        self.project.risk_level = predicted_risk
        self.project.save()
        
        # 👇 2. NEW: Save the Risk Level to THIS Daily Report 👇
        self.risk_level = predicted_risk
        
        print(f"--- AI LOG: Inputs(Labor={self.labor_count}, Weather={weather_score}, Material={material_score}) -> Prediction: {predicted_risk} ---")
        
        super().save(*args, **kwargs)