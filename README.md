# PHISHX

**Machine Learning URL Risk Analysis Pipeline**

PhishX is a detection engine that analyzes URL structures and metadata to classify links as benign or malicious using machine learning.

### Architecture
- **Backend**: Flask, Python
- **ML Engine**: Scikit-Learn (TF-IDF vectorization, Logistic Regression)
- **Features**: Lexical analysis, domain reputation scoring, and path anomaly detection.

### Core Capabilities
- **Automated Extraction**: Parses URLs into 15+ distinct lexical features.
- **Inference API**: Exposes a REST endpoint for real-time classification.
- **Model Training**: Includes scripts to retrain the classifier on custom threat intel feeds.

### Setup
```bash
git clone https://github.com/Diode11-Alt/PhishX.git
cd PhishX
pip install -r requirements.txt
python3 backend/app.py
```

---
*Developed by Sujal Mainali · [GitHub](https://github.com/Diode11-Alt)*
