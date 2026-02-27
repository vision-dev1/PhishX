<div align="center">

# 🛡️ PhishX

### Advanced AI-Powered Phishing Detection

[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**PhishX** is a full-stack cybersecurity web application that uses Machine Learning to detect phishing threats across emails, URLs, and QR codes — with real-time results and confidence scoring.

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-reference)  • [ML Details](#-machine-learning)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 📧 **Email Analysis** | Detects phishing language, urgency tactics, and deceptive patterns using TF-IDF + Logistic Regression |
| 🔗 **URL Checker** | Analyzes 15+ URL features — domain, special characters, HTTPS, IP usage — with Random Forest |
| 📱 **QR Code Scan** | Decodes QR images, extracts embedded URLs, and runs them through the phishing model |
| 🌗 **Dark Mode** | Full dark/light theme toggle, preference saved to localStorage |
| 📊 **Live Counters** | Animated scan, user, and organization statistics |

---

## 🛠️ Tech Stack

**Backend:** Python 3.8+, Flask, scikit-learn, OpenCV, pyzbar, joblib, NumPy

**Frontend:** HTML5, TailwindCSS (CDN), Vanilla JavaScript

**ML Models:** TF-IDF Vectorization, Logistic Regression (email), Random Forest (URL)

---

## 📁 Project Structure

```
PhishX/
├── backend/
│   ├── app.py                    # Flask API server
│   ├── train_email_model.py      # Email model trainer
│   ├── train_url_model.py        # URL model trainer
│   ├── requirements.txt          # Python dependencies
│   └── models/                   # Auto-generated after training
│       ├── email_model.pkl
│       ├── email_vectorizer.pkl
│       ├── url_model.pkl
│       └── url_scaler.pkl
├── frontend/
│   ├── index.html                # Main UI
│   ├── style.css                 # Custom styles
│   ├── script.js                 # Frontend logic & API calls
│   └── assets/                   # Images & icons
├── utils/
│   └── qr_scanner.py             # QR code decoder
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- **Python 3.8+** and **pip**
- **System library for QR scanning (`pyzbar`)**:

| OS | Command |
|---|---|
| Ubuntu / Debian | `sudo apt-get install libzbar0` |
| macOS | `brew install zbar` |
| Windows | Download from [ZBar SourceForge](https://sourceforge.net/projects/zbar/files/) |

---

### Step 1 — Clone & Enter the Project

```bash
git clone https://github.com/yourusername/PhishX.git
cd PhishX
```

### Step 2 — Create & Activate a Virtual Environment

```bash
python -m venv venv
```

| Platform | Activation Command |
|---|---|
| Linux / macOS | `source venv/bin/activate` |
| Windows (CMD) | `venv\Scripts\activate` |
| Windows (PowerShell) | `.\venv\Scripts\Activate.ps1` |

### Step 3 — Install Dependencies

```bash
pip install -r backend/requirements.txt
```

### Step 4 — Train the ML Models

> ⚠️ **Required before first run.** This generates the `.pkl` model files.

```bash
python backend/train_email_model.py
python backend/train_url_model.py
```

### Step 5 — Start the Server

```bash
python backend/app.py
```

Open your browser at **[http://localhost:5000](http://localhost:5000)** 🎉

---

## 📖 Usage

### 📧 Email Analysis
1. Click the **Email Analysis** card
2. Paste the full email (headers + body) into the textarea
3. Press **`Ctrl + Enter`** or click **Analyze Email**

```
Example phishing email:
URGENT: Your account will be suspended. Click here immediately to verify your credentials.
```

### 🔗 URL Checker
1. Click the **Link Checker** card
2. Enter the suspicious URL
3. Press **`Enter`** or click **Check URL**

```
Example phishing URL:
http://paypal-secure-login.com/verify-account?user=you
```

### 📱 QR Code Scanner
1. Click the **QR Code Scan** card
2. Drag & drop or upload a QR image (PNG, JPG, SVG)
3. Click **Scan Image**

---

## 🔌 API Reference

**Base URL:** `http://localhost:5000`

### `POST /detect/email`
```json
// Request
{ "text": "Your account will be suspended..." }

// Response
{ "result": "Phishing", "confidence": "92.5%", "raw_confidence": 92.5 }
```

### `POST /detect/url`
```json
// Request
{ "url": "https://suspicious-site.com/login" }

// Response
{ "result": "Legitimate", "confidence": "87.3%", "raw_confidence": 87.3 }
```

### `POST /detect/qr`
Multipart form data with an `image` field.
```json
// Response
{ "decoded_url": "http://phishing-site.com", "result": "Phishing", "confidence": "95.2%" }
```

### `GET /health`
```json
{ "status": "healthy", "email_model_loaded": true, "url_model_loaded": true }
```

---

## 🧠 Machine Learning

### Email Model
- **Algorithm:** Logistic Regression
- **Vectorizer:** TF-IDF (5,000 features)
- **Accuracy:** ~95% on test set

### URL Model
- **Algorithm:** Random Forest (100 estimators)
- **Features (15+):** URL length, dot/dash/slash counts, HTTPS flag, IP address detection, suspicious keyword matches, domain length, redirect patterns
- **Accuracy:** ~95% on test set

### Improving for Production
- Replace synthetic training data with **real-world datasets** (PhishTank, OpenPhish, Enron corpus)
- Integrate **VirusTotal** or **Google Safe Browsing** API
- Use **BERT/LSTM** for deeper email NLP
- Add **WHOIS** and **SSL certificate validation**

---

## 🔮 Roadmap

- [ ] Docker containerization
- [ ] Browser extension for automatic URL checking
- [ ] Real-time threat intelligence feed (VirusTotal API)
- [ ] Advanced NLP models (BERT, GPT)
- [ ] API key authentication & rate limiting
- [ ] Email client plugin (Gmail / Outlook)
- [ ] Mobile app for QR scanning
- [ ] Multi-language support

---

## 🤝 Contributing

Contributions are welcome! Areas of interest:
- Improved / real-world ML training datasets
- UI/UX enhancements
- Additional phishing detection heuristics
- Bug fixes and performance improvements

Please open an issue first to discuss major changes.

---

## 📄 License

This project is licensed under the **MIT License**.See the [LICENSE](LICENSE) file for deatils.

---

## 👨‍💻 Author

**Vision KC**<br>
[Portfolio](https://visionkc.com.np)<br>
[Github](https://github.com/vision-dev1)

> *Built as a cybersecurity portfolio project demonstrating full-stack development, machine learning, and security awareness.*

---

<div align="center">

**⚡ Stay vigilant. Stay secure. ⚡**

</div>
