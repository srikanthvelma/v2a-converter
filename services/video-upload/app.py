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
    video_file = request.files['video']
    video_id = request.form['videoId']
    if not video_id:
        return jsonify({'error': 'No videoId provided'}), 400
    video_file.save(os.path.join(UPLOAD_FOLDER, video_id + '.mp4'))
    return jsonify({'message': 'Video uploaded successfully'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
