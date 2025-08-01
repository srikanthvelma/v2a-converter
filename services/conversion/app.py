from flask import Flask, request, jsonify
import os

app = Flask(__name__)
CONVERTED_FOLDER = 'converted'
os.makedirs(CONVERTED_FOLDER, exist_ok=True)

@app.route('/', methods=['GET'])
def health():
    return 'Conversion Service is running'

@app.route('/convert', methods=['POST'])
def convert_video():
    data = request.get_json()
    filename = data.get('filename')
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
    # Simulate conversion (in real app, run ffmpeg or similar)
    audio_filename = filename.rsplit('.', 1)[0] + '.mp3'
    audio_path = os.path.join(CONVERTED_FOLDER, audio_filename)
    # Simulate file creation
    with open(audio_path, 'w') as f:
        f.write('FAKE AUDIO DATA')
    return jsonify({'message': 'Conversion complete', 'audio_file': audio_filename, 'job_id': '12345'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
