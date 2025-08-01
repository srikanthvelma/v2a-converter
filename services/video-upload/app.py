from flask import Flask, request, jsonify
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/', methods=['GET'])
def health():
    return 'Video Upload Service is running'

@app.route('/upload', methods=['POST'])
def upload_video():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    # In a real app, trigger conversion here and return a job ID
    return jsonify({'message': 'File uploaded successfully', 'filename': file.filename, 'job_id': '12345'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
