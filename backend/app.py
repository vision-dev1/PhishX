import os
import sys
import re
import joblib
import numpy as np
from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
from werkzeug.utils import safe_join

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from utils.qr_scanner import decode_qr_code

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024

CORS(app, origins=[
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
])

email_model = None
email_vectorizer = None
url_model = None
url_scaler = None

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def load_models():
    global email_model, email_vectorizer, url_model, url_scaler
    model_dir = os.path.join(os.path.dirname(__file__), 'models')
    try:
        email_model = joblib.load(os.path.join(model_dir, 'email_model.pkl'))
        email_vectorizer = joblib.load(os.path.join(model_dir, 'email_vectorizer.pkl'))
        print("email model loaded")
    except Exception as e:
        print(f"could not load email model: {e}")
    try:
        url_model = joblib.load(os.path.join(model_dir, 'url_model.pkl'))
        url_scaler = joblib.load(os.path.join(model_dir, 'url_scaler.pkl'))
        print("url model loaded")
    except Exception as e:
        print(f"could not load url model: {e}")

def extract_url_features(url):
    features = []
    features.append(len(url))
    features.append(url.count('.'))
    features.append(url.count('-'))
    features.append(url.count('_'))
    features.append(url.count('/'))
    features.append(url.count('?'))
    features.append(url.count('='))
    features.append(url.count('@'))
    features.append(url.count('&'))
    features.append(1 if url.startswith('https://') else 0)
    ip_pattern = r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}'
    features.append(1 if re.search(ip_pattern, url) else 0)
    suspicious_keywords = ['login', 'verify', 'account', 'update', 'secure', 'banking',
                          'confirm', 'suspend', 'click', 'urgent', 'password', 'paypal']
    features.append(sum(1 for keyword in suspicious_keywords if keyword in url.lower()))
    domain_part = url.split('/')[2] if len(url.split('/')) > 2 else url
    features.append(len(domain_part))
    features.append(url.count('//') - 1)
    features.append(1 if url.count('-') > 3 else 0)
    return features

FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))

@app.route('/')
def index():
    if not os.path.isdir(FRONTEND_DIR):
        return jsonify({'error': 'frontend not built, run npm run build first'}), 500
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if not os.path.isdir(FRONTEND_DIR):
        abort(404)
    try:
        resolved = safe_join(FRONTEND_DIR, path)
    except Exception:
        abort(404)
    if resolved is None or not os.path.isfile(resolved):
        return send_from_directory(FRONTEND_DIR, 'index.html')
    return send_from_directory(FRONTEND_DIR, path)

@app.route('/detect/email', methods=['POST'])
def detect_email():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'no email text provided'}), 400

        email_text = data['text'].strip()
        if not email_text:
            return jsonify({'error': 'email text is empty'}), 400

        if len(email_text) > 50000:
            return jsonify({'error': 'input too long'}), 400

        if email_model is None or email_vectorizer is None:
            return jsonify({'error': 'email model not loaded, train the model first'}), 500

        email_vectorized = email_vectorizer.transform([email_text])
        prediction = email_model.predict(email_vectorized)[0]
        probability = email_model.predict_proba(email_vectorized)[0]
        confidence = max(probability) * 100
        result = "Phishing" if prediction == 1 else "Legitimate"

        return jsonify({
            'result': result,
            'confidence': f"{confidence:.1f}%",
            'raw_confidence': float(confidence)
        })
    except Exception:
        return jsonify({'error': 'failed to process email'}), 500

@app.route('/detect/url', methods=['POST'])
def detect_url():
    try:
        data = request.get_json()
        if not data or 'url' not in data:
            return jsonify({'error': 'no url provided'}), 400

        url = data['url'].strip()
        if not url:
            return jsonify({'error': 'url is empty'}), 400

        if len(url) > 2048:
            return jsonify({'error': 'url too long'}), 400

        if url_model is None or url_scaler is None:
            return jsonify({'error': 'url model not loaded, train the model first'}), 500

        features = extract_url_features(url)
        features_array = np.array([features])
        features_scaled = url_scaler.transform(features_array)
        prediction = url_model.predict(features_scaled)[0]
        probability = url_model.predict_proba(features_scaled)[0]
        confidence = max(probability) * 100
        result = "Phishing" if prediction == 1 else "Legitimate"

        return jsonify({
            'result': result,
            'confidence': f"{confidence:.1f}%",
            'raw_confidence': float(confidence)
        })
    except Exception:
        return jsonify({'error': 'failed to process url'}), 500

@app.route('/detect/qr', methods=['POST'])
def detect_qr():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'no image file provided'}), 400

        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({'error': 'no file selected'}), 400

        if not allowed_file(image_file.filename):
            return jsonify({'error': 'invalid file type'}), 400

        image_data = image_file.read()
        if len(image_data) < 100:
            return jsonify({'error': 'file too small to be a valid image'}), 400

        decoded_url, error = decode_qr_code(image_data)
        if error and not decoded_url:
            return jsonify({'error': error}), 400

        if url_model is None or url_scaler is None:
            return jsonify({
                'decoded_url': decoded_url,
                'result': 'Unknown',
                'confidence': 'N/A',
                'error': 'url model not loaded'
            })

        features = extract_url_features(decoded_url)
        features_array = np.array([features])
        features_scaled = url_scaler.transform(features_array)
        prediction = url_model.predict(features_scaled)[0]
        probability = url_model.predict_proba(features_scaled)[0]
        confidence = max(probability) * 100
        result = "Phishing" if prediction == 1 else "Legitimate"

        response = {
            'decoded_url': decoded_url,
            'result': result,
            'confidence': f"{confidence:.1f}%",
            'raw_confidence': float(confidence)
        }
        if error:
            response['warning'] = error
        return jsonify(response)
    except Exception:
        return jsonify({'error': 'failed to process qr code'}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'email_model_loaded': email_model is not None,
        'url_model_loaded': url_model is not None
    })

if __name__ == '__main__':
    print("loading models...")
    load_models()
    print("starting server on http://localhost:5000")
    app.run(host='127.0.0.1', port=5000)
