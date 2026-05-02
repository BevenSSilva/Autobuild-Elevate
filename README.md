```mermaid
graph LR
    A["INPUT DATA<br>(Labor, Weather, Material)"] --> B["DATA PREPROCESSING<br>(Pandas Mapping)"]
    B --> C["ML MODEL TRAINING<br>(Random Forest)"]
    C --> D["PREDICTION<br>(Low / High Risk)"]
    D --> E["DASHBOARD VISUALIZATION<br>(React UI)"]
    
    style A fill:#4a86e8,stroke:#000,stroke-width:2px,color:#fff
    style B fill:#4a86e8,stroke:#000,stroke-width:2px,color:#fff
    style C fill:#4a86e8,stroke:#000,stroke-width:2px,color:#fff
    style D fill:#4a86e8,stroke:#000,stroke-width:2px,color:#fff
    style E fill:#4a86e8,stroke:#000,stroke-width:2px,color:#fff
