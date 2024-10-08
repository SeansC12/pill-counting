import numpy as np
from scipy import stats
from colour import find_damaged_pills_by_colour

# (0) Red: Difference between blob and trgoh detection
# (1) Blue: Area
# (2) Yellow: Colour

def find_damaged_pills_by_difference(counting_predictions, blob_predictions, distance_betw_trgoh_and_blob_max): # Finding anomalous pills where trgoh does not detect it while blob detection does
    # For each blob_prediction, find the nearest counting_prediction based on their x and y value
    for blob in blob_predictions:
        x, y = blob
        min_distance = float("inf")
        for counting_prediction in counting_predictions:
            x_counting, y_counting = counting_prediction["x"], counting_prediction["y"]
            distance = ((x - x_counting) ** 2 + (y - y_counting) ** 2) ** 0.5
            if distance < min_distance:
                min_distance = distance
        
        print(min_distance, min_distance > distance_betw_trgoh_and_blob_max)
        
        if min_distance > distance_betw_trgoh_and_blob_max:
            new_dict_to_append = {
                "x": x,
                "y": y,
                "is_added": True,
                "is_damaged": True,
                "damaged_index": 0,
                "damaged_signature": "Difference between blob and trgoh detection distance."
            }
            counting_predictions.append(new_dict_to_append)

def find_damaged_pills_by_area(counting_predictions, area_threshold):
    ROUND_BASE = 5
    areas = list()
    areas_rounded = list()
    # Calculate mode area of counting_predictions by rounding it off
    for counting_prediction in counting_predictions:
        if counting_prediction["is_added"]: continue
        area = counting_prediction["width"] * counting_prediction["height"]
        areas.append(area)
        areas_rounded.append(ROUND_BASE * round(area / ROUND_BASE))
    
    mode = stats.mode(areas_rounded)

    for counting_prediction in counting_predictions:
        if counting_prediction["is_added"]: continue
        area = counting_prediction["width"] * counting_prediction["height"]
        if abs(area - mode[0]) > (0.3 * mode[0]):
            counting_prediction["is_damaged"] = True
            counting_prediction["damaged_index"] = 1
            counting_prediction["damaged_signature"] = "Area too different from the mode."

def find_damaged_pills_by_area_z_score(counting_predictions, threshold):
    anomalies = list()
    def z_score_outliers(data, threshold):
        mean = np.mean(data)
        std = np.std(data)
        z_scores = [(x - mean) / std for x in data]
        outliers = [x for i, x in enumerate(data) if np.abs(z_scores[i]) > threshold]
        return outliers
    
    areas = [counting_prediction["width"] * counting_prediction["height"] for counting_prediction in counting_predictions]
    anomalies = z_score_outliers(areas, threshold)

    print(areas, anomalies)

    for counting_prediction in counting_predictions:
        if counting_prediction["width"] * counting_prediction["height"] in anomalies:
            counting_prediction["is_damaged"] = True
            counting_prediction["damaged_index"] = 1
            counting_prediction["damaged_signature"] = "Area too different from the mode (by z_score outliers)."

def generate_final_pill_dict(counting_predictions, blob_predictions, distance_betw_trgoh_and_blob_max, area_threshold, image):
    for counting_prediction in counting_predictions:
        counting_prediction["is_damaged"] = False
        counting_prediction["is_added"] = False
        counting_prediction["damaged_signature"] = "Healthy"
        counting_prediction["damaged_index"] = -1
    
    find_damaged_pills_by_difference(counting_predictions, blob_predictions, distance_betw_trgoh_and_blob_max)
    
    find_damaged_pills_by_area(counting_predictions, 300)

    find_damaged_pills_by_colour(counting_predictions, image)
    return counting_predictions