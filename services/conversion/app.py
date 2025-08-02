from flask import Flask, request, jsonify
import os

app = Flask(__name__)
UPLOAD_FOLDER = '/data/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
AUDIO_FOLDER = '/data/audio'
os.makedirs(AUDIO_FOLDER, exist_ok=True)

@app.route('/', methods=['GET'])
def health():
    return 'Conversion Service is running'

@app.route('/convert', methods=['POST'])
def convert_video():
    data = request.get_json()
    filename = data.get('filename')
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
    # Perform video-to-audio conversion using FFmpeg
    input_file = os.path.join(UPLOAD_FOLDER, filename)
    output_file = os.path.join(AUDIO_FOLDER, filename.rsplit('.', 1)[0] + '.mp3')
    subprocess.run(['ffmpeg', '-i', input_file, '-vn', '-ar', '44100', '-ac', '2', '-ab', '192k', output_file])

    return jsonify({'message': 'Conversion complete', 'audio_file': output_file})
    # Simulate conversion (in real app, run ffmpeg or similar)
    audio_filename = filename.rsplit('.', 1)[0] + '.mp3'
    audio_path = os.path.join(AUDIO_FOLDER, audio_filename)
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
