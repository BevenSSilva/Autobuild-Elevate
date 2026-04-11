import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import numpy as np

class RiskPredictor:
    def __init__(self):
        # class_weight='balanced' prevents bias towards the majority class
        self.model = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
        self.train_dummy_model()

    def train_dummy_model(self):
        # FORMAT: [Labor, Weather, Material]
        # ENCODING GUIDE:
        # Weather:  10 = Sunny, 5 = Rain, 1 = Storm
        # Material: 100 = Sufficient, 50 = Low, 10 = Critical

        X_train = [
            # --- HEALTHY PROJECTS (Low Risk: 0) ---
            [10, 10, 90],  # 10 workers, Sunny, Good materials
            [8, 10, 80],   
            [8, 10, 100],  
            [12, 10, 100],
            [15, 10, 85],
            [4, 10, 100],  # EXACTLY 4 workers (Minimum healthy), Sunny, Good materials
            [10, 5, 100],  # Rain, but plenty of labor and materials to handle it
            
            # --- LOW LABOR RISKS (High Risk: 1) ---
            [3, 10, 100],  # 3 workers (Too few), Sunny, Good materials
            [2, 10, 100],  
            [1, 10, 100],

            # --- BAD WEATHER (STORM) RISKS (High Risk: 1) ---
            [20, 1, 100],  # Max labor & materials, but it's a Storm
            [15, 1, 90],  
            [10, 1, 80],  
            
            # --- CRITICAL MATERIAL RISKS (High Risk: 1) ---
            [10, 10, 10],  # Sunny & Good Labor, but Critical Materials
            [12, 10, 5],   
            [8, 10, 20],   

            # --- COMBINATION RISKS (High Risk: 1) ---
            [10, 5, 40],   # Rain (5) + Low Materials (40) = Wet and running out
            [7, 5, 100],   # Rain (5) + Labor < 8 (7) = Not enough hands to secure site from rain
            [5, 5, 50],    # Rain (5) + Low Labor (5) + Low Material (50)
        ]
        
        y_train = [
            # Healthy (7)
            0, 0, 0, 0, 0, 0, 0,
            # Low Labor (3)
            1, 1, 1,          
            # Storm (3)
            1, 1, 1,          
            # Critical Material (3)
            1, 1, 1,
            # Combinations (3)
            1, 1, 1
        ]
        
        self.model.fit(X_train, y_train)

    def predict_risk(self, labor, weather, material):
        # ---------------------------------------------------------
        # 1. THE ENTERPRISE GUARDRAILS (Absolute logic overrides AI)
        # ---------------------------------------------------------
        
        # Rule 1: Less than 4 workers is High Risk (3 is dangerous)
        if labor <= 3:
            return "High Risk"
            
        # Rule 2: Storms are always High Risk
        if weather <= 1:
            return "High Risk"
            
        # Rule 3: Critical Material Shortage is always High Risk
        if material <= 20:
            return "High Risk"
            
        # Rule 4: Combination - Rain + Low Materials
        if weather <= 5 and material <= 50:
            return "High Risk"
            
        # Rule 5: Combination - Rain + Not enough hands to secure site (Labor < 8)
        if weather <= 5 and labor < 8:
            return "High Risk"

        # ---------------------------------------------------------
        # 2. THE ML ENGINE (For normal, nuanced conditions)
        # ---------------------------------------------------------
        input_data = [[labor, weather, material]]
        
        probability = self.model.predict_proba(input_data)[0][1]
        
        if probability > 0.55:
            return "High Risk"
        else:
            return "Low Risk"

# --- Quick Test ---
if __name__ == "__main__":
    predictor = RiskPredictor()
    
    print("--- HARD RULE TESTS ---")
    print("Test 1 (Storm, Max Labor, Max Mat):", predictor.predict_risk(labor=20, weather=1, material=100)) 
    print("Test 2 (Sunny, 3 Labor, Max Mat):", predictor.predict_risk(labor=3, weather=10, material=100))   
    print("Test 3 (Sunny, 4 Labor, Max Mat):", predictor.predict_risk(labor=4, weather=10, material=100))   
    
    print("\n--- COMBINATION TESTS ---")
    print("Test 4 (Rain, 10 Labor, Low Mat):", predictor.predict_risk(labor=10, weather=5, material=40))    
    print("Test 5 (Rain, 7 Labor, Max Mat):", predictor.predict_risk(labor=7, weather=5, material=100))     
    
    print("\n--- NUANCED ML TESTS ---")
    print("Test 6 (Normal Good Day):", predictor.predict_risk(labor=10, weather=9, material=85))            
    print("Test 7 (Slightly dropping params):", predictor.predict_risk(labor=8, weather=8, material=60))