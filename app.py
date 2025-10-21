import os
import google.generativeai as genai
from google.generativeai import types
from flask import Flask, render_template, request, jsonify
from PIL import Image
from io import BytesIO
import uuid  # To create unique filenames
import atexit

app = Flask(__name__)

# --- Configuration ---
# Ensure the folder for generated images exists
GENERATED_IMG_DIR = "static/generated-images"
if not os.path.exists(GENERATED_IMG_DIR):
    os.makedirs(GENERATED_IMG_DIR)

# Load the API key from Render's environment variables
API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("WARNING: GEMINI_API_KEY not found. API calls will fail.")
    # You can set a default or raise an error, but for Render, we'll let it try

genai.configure(api_key=API_KEY)
client = genai.Client(api_key=API_KEY)

# --- Routes ---

@app.route('/')
def index():
    """Serves the main HTML page."""
    return render_template('index.html')

@app.route('/generate-image', methods=['POST'])
def handle_generate_image():
    """Handles the image generation request from the frontend."""
    if not API_KEY:
        return jsonify({"error": "Server is missing API key."}), 500

    try:
        # Get data from the frontend
        data = request.json
        prompt = data.get('prompt')
        aspect_ratio = data.get('aspect_ratio')

        if not prompt:
            return jsonify({"error": "Prompt is required."}), 400

        # --- Call the Google Imagen API ---
        print(f"Generating image with prompt: {prompt}")
        response = client.models.generate_images(
            model="imagen-3.0-generate-002",  # The powerful Imagen 3 model
            prompt=prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio=aspect_ratio,
            )
        )

        # --- Process and Save the Image ---
        image_bytes = response.generated_images[0].image.image_bytes
        image = Image.open(BytesIO(image_bytes))

        # Create a unique filename
        filename = f"{uuid.uuid4()}.png"
        save_path = os.path.join(GENERATED_IMG_DIR, filename)
        image.save(save_path)

        # Send the *URL* of the saved image back to the frontend
        image_url = f"/{save_path}" # e.g., /static/generated-images/1234.png
        print(f"Image saved to: {image_url}")

        return jsonify({"url": image_url, "prompt": prompt})

    except Exception as e:
        print(f"Error during image generation: {e}")
        # Check for specific auth errors
        if "API key not valid" in str(e):
             return jsonify({"error": "The provided GEMINI_API_KEY is invalid."}), 500
        return jsonify({"error": f"An error occurred: {e}"}), 500

# --- Cleanup ---
def cleanup_generated_images():
    """Deletes generated images on application exit to save space."""
    print("Cleaning up generated images...")
    for f in os.listdir(GENERATED_IMG_DIR):
        if f != ".gitkeep": # Don't delete the .gitkeep file
            os.remove(os.path.join(GENERATED_IMG_DIR, f))

# Register the cleanup function to run when the app exits
atexit.register(cleanup_generated_images)

if __name__ == '__main__':
    app.run(debug=True)