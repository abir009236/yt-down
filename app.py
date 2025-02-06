# Add at the top of app.py
import os

# Change the last lines to:
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
    from flask import Flask, render_template, request, jsonify, send_file, Response
from flask_cors import CORS
from pytube import YouTube
import os
import re

app = Flask(__name__, template_folder='.')
CORS(app)

def is_valid_youtube_url(url):
    youtube_regex = (
        r'(https?://)?(www\.)?'
        '(youtube|youtu|youtube-nocookie)\.(com|be)/'
        '(watch\?v=|embed/|v/|.+\?v=)?([^&=%\?]{11})')
    return bool(re.match(youtube_regex, url))

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/how-it-works')
def how_it_works():
    return render_template("how-it-works.html")

@app.route('/faq')
def faq():
    return render_template("faq.html")

@app.route('/contact')
def contact():
    return render_template("contact.html")

@app.route('/terms')
def terms():
    return render_template("terms.html")

@app.route('/get-video-info', methods=['POST'])
def get_video_info():
    try:
        data = request.json
        video_url = data.get("url")
        
        if not video_url or not is_valid_youtube_url(video_url):
            return jsonify({"error": "Invalid YouTube URL"}), 400

        yt = YouTube(video_url)
        streams = yt.streams.filter(progressive=True).order_by('resolution').desc()
        
        formats = []
        for stream in streams:
            formats.append({
                'itag': stream.itag,
                'resolution': stream.resolution,
                'filesize': f"{stream.filesize / (1024*1024):.1f} MB",
                'mime_type': stream.mime_type
            })

        return jsonify({
            "title": yt.title,
            "thumbnail": yt.thumbnail_url,
            "duration": yt.length,
            "author": yt.author,
            "formats": formats
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/download', methods=['POST'])
def download_video():
    try:
        data = request.json
        video_url = data.get("url")
        itag = data.get("itag")
        
        if not video_url:
            return jsonify({"error": "No URL provided"}), 400
            
        if not is_valid_youtube_url(video_url):
            return jsonify({"error": "Invalid YouTube URL"}), 400

        try:
            yt = YouTube(video_url)
        except Exception as e:
            return jsonify({"error": "Failed to fetch video information. Please check the URL."}), 400

        # Get the stream based on itag or highest resolution
        if itag:
            stream = yt.streams.get_by_itag(itag)
            if not stream:
                return jsonify({"error": "Selected format is not available"}), 400
        else:
            stream = yt.streams.get_highest_resolution()
            if not stream:
                return jsonify({"error": "No suitable format found"}), 400

        # Get the direct download URL
        try:
            download_url = stream.url
        except Exception as e:
            return jsonify({"error": "Failed to generate download URL"}), 500

        # Clean filename
        filename = f"{yt.title}.mp4"
        filename = re.sub(r'[^\w\s-]', '', filename)
        filename = re.sub(r'[-\s]+', '-', filename).strip('-_')
        
        return jsonify({
            "download_url": download_url,
            "filename": filename,
            "filesize": f"{stream.filesize / (1024*1024):.1f} MB",
            "resolution": stream.resolution
        })

    except Exception as e:
        app.logger.error(f"Download error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

if __name__ == '__main__':
    app.run(debug=True)