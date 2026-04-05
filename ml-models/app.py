import os
import json
import math
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


@app.route("/ml/ocr", methods=["POST"])
def ocr_survey():
    """
    Accepts a base64-encoded image of a paper field survey.
    Uses Gemini 1.5 Flash to extract handwritten text and return structured JSON.
    """
    data = request.get_json()
    image_b64 = data.get("image")
    mime_type = data.get("mimeType", "image/jpeg")

    if not image_b64:
        return jsonify({"error": "No image provided"}), 400

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = """Analyze this field survey image. Extract the following information and return ONLY valid JSON:
{
  "location": "the location or area mentioned",
  "needs": "the resources or supplies needed",
  "quantity": <number of items needed as integer>,
  "urgency": "Critical" or "High" or "Medium",
  "notes": "any additional observations"
}
If you cannot determine a field, use reasonable defaults. Return ONLY the JSON object, no markdown."""

        image_part = {
            "mime_type": mime_type,
            "data": base64.b64decode(image_b64),
        }

        response = model.generate_content([prompt, image_part])
        text = response.text.strip()

        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
            text = text.strip()

        parsed = json.loads(text)
        return jsonify(parsed)

    except json.JSONDecodeError:
        return jsonify({
            "location": "Unknown",
            "needs": "General Supplies",
            "quantity": 1,
            "urgency": "Medium",
            "notes": f"Raw OCR: {text[:500]}",
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/ml/match", methods=["POST"])
def match_volunteer():
    """
    Smart matching algorithm.
    Accepts a task location and list of volunteer coordinates.
    Returns the closest/best volunteer.
    """
    data = request.get_json()
    task_location = data.get("taskLocation", "")
    volunteers = data.get("volunteers", [])

    if not volunteers:
        return jsonify({"error": "No volunteers provided"}), 400

    location_coords = {
        "Sector 4 - Elderly Home": (28.615, 77.220),
        "Sector 17 - Park Area": (28.625, 77.215),
        "Sector 22 - Market": (28.630, 77.230),
        "NH-44 Toll Junction": (28.600, 77.240),
        "Industrial Phase II": (28.610, 77.250),
    }

    task_lat, task_lng = location_coords.get(task_location, (28.615, 77.225))

    def haversine(lat1, lng1, lat2, lng2):
        R = 6371  # km
        dlat = math.radians(lat2 - lat1)
        dlng = math.radians(lng2 - lng1)
        a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2) ** 2
        return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    scored = []
    for v in volunteers:
        dist = haversine(task_lat, task_lng, v.get("lat", 0), v.get("lng", 0))
        scored.append({**v, "distance_km": round(dist, 2)})

    scored.sort(key=lambda x: x["distance_km"])
    best = scored[0]

    return jsonify({
        "bestMatch": best,
        "allCandidates": scored,
        "taskLocation": task_location,
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "smog-setu-ml"})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)
