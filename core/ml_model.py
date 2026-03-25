import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import numpy as np

class RiskPredictor:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.train_dummy_model()

    def train_dummy_model(self):
       
        
        X_train = [
            
            [10, 10, 90], 
            [8, 10, 80],  
            [8, 8, 80],   
            [12, 10, 100],
            [15, 9, 85],
            [7, 10, 90],  

           
            [2, 10, 100], 
            [4, 8, 90],
            [5, 5, 50],

            [20, 1, 100], 
            [15, 4, 90],  
            [10, 4, 80],  
            
            [10, 10, 10],
            [2, 10, 10],
        ]
        
        y_train = [
            0, 0, 0, 0, 0, 0, 
            1, 1, 1,          
            1, 1, 1,          
            1,0             
        ]
        
        self.model.fit(X_train, y_train)

    def predict_risk(self, labor, weather, material):
        input_data = [[labor, weather, material]]
        
        probability = self.model.predict_proba(input_data)[0][1]
        
        if probability > 0.55:
            return "High Risk"
        else:
            return "Low Risk"