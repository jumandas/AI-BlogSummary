from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from openai import OpenAI
import os
from reportlab.pdfgen import canvas
import asyncio 

app = Flask(__name__)
CORS(app)

# client = OpenAI(
#     api_key= "key"
# )

@app.route('/summarize', methods=['POST'])
# This endpoint receives text from the React frontend, sends it to the OpenAI API for summarization, and returns the summary.
def summarize_text():
    data = request.json
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    try:
        response = client.responses.create(
            model="gpt-4.1",
            # messages=[{"role": "user", "content": f"Summarize this:\n\n{text}"}],
            input= f"Summarize this:\n\n{text}"
        )
        print(response)
        summary = response.output_text
        return jsonify({'summary': summary})
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@app.route('/download-pdf', methods=['POST'])
# This endpoint receives a summary from the React frontend, generates a PDF file with the summary, and sends it back as a downloadable file.
# It uses the ReportLab library to create the PDF.
def download_pdf():
    data = request.json
    summary = data.get('summary', '')
    file_path = "summary.pdf"

    c = canvas.Canvas(file_path)
    text_object = c.beginText(40, 800)
    text_object.setFont("Helvetica", 12)

    for line in summary.split('\n'):
        text_object.textLine(line)

    c.drawText(text_object)
    c.save()

    return send_file(file_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)