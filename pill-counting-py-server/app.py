from flask import Flask, request
from flask_cors import CORS, cross_origin
from inference_sdk import InferenceConfiguration, InferenceHTTPClient
from blobs import get_all_blob_coordinates
from get_damage_pill_utils import generate_final_pill_dict
from ultralytics import YOLO
from helpers import convert_b64_to_image
import cv2
import os
from dotenv import load_dotenv
import json

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

load_dotenv()

# Counting model config
MODEL_ID = "trgoh/1"
model = YOLO("trgoh.pt")

# warm_up_image = cv2.imread("warm_up.jpg")
# for i in range(20):
#     print(f"warm up {i}")
#     model.predict(warm_up_image)

# Counting inferencing
def get_counting_inference(image):
    cv2.imwrite("temp.jpg", convert_b64_to_image(image))
    result = model.predict("temp.jpg")
    # Return the predictions of the YOLO model by returning the x and y coordinates, and width and height of the bounding box
    result = result[0].boxes.xywh.tolist()
    counting_predictions = list()
    for i in result:
        counting_predictions.append({
            "x": i[0],
            "y": i[1],
            "width": i[2],
            "height": i[3],
            "is_damaged": False,
            "is_added": False,
            "damaged_signature": "Healthy",
            "damaged_index": -1
        })
    return counting_predictions

@app.route("/", methods=["GET", "POST"])
@cross_origin(send_wildcard=True)
def index():
    req_data = request.get_json(force=True)
    image = req_data["image"]

    if image == None or image == "":
        return json.dumps({"error": "Something went wrong in image transmission."}), 400

    counting_predictions = get_counting_inference(image)
    blob_predictions = get_all_blob_coordinates(image)
    
    final_pill_dict = generate_final_pill_dict(counting_predictions, blob_predictions, 50, 1, image)

    return final_pill_dict

if __name__=='__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)