from flask import Flask, request
from flask_cors import CORS, cross_origin
# from inference_sdk import InferenceConfiguration, InferenceHTTPClient
from blobs import get_all_blob_coordinates
from get_damage_pill_utils import generate_final_pill_dict
import os
import cv2
from helpers import convert_b64_to_image
from roboflow import Roboflow
from dotenv import load_dotenv
import json

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

load_dotenv()

# Counting model config
MODEL_ID = "trgoh/1"

rf = Roboflow(api_key=os.getenv("ROBOFLOW_API_KEY"))
project = rf.workspace().project("trgoh")
# model = project.version(version_number=1, local=os.getenv("INFERENCE_SERVER_URL")+"/").model
model = project.version(1).model

model.confidence = 50
model.overlap = 80

# config = InferenceConfiguration(confidence_threshold=0.5, iou_threshold=0.8)
# counting_client = InferenceHTTPClient(api_url=os.getenv("INFERENCE_SERVER_URL"), api_key=os.getenv("ROBOFLOW_API_KEY"))
# counting_client.configure(config)
# counting_client.select_model(MODEL_ID)

# Counting inferencing
def get_counting_inference(image):
    cv2.imwrite("temp.jpg", convert_b64_to_image(image))
    counting_predictions = model.predict("temp.jpg").json()
    # counting_predictions = counting_client.infer(image)
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
    
    # print(counting_predictions)

    final_pill_dict = generate_final_pill_dict(counting_predictions["predictions"], blob_predictions, 50, 1, image)

    return final_pill_dict

if __name__=='__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
