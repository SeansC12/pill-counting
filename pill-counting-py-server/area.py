from scipy import stats
import cv2
import numpy as np
from helpers import convert_b64_to_image

# initialise upper and lower bound for white
white_lower = np.array([200, 200, 200])
white_upper = np.array([255, 255, 255])

#initialisie upper and lower bound for black
black_lower = np.array([0, 0, 0])
black_upper = np.array([55, 55, 55])

def calculate_area(image, x_of_centre, y_of_centre, width, height):
    left_x, right_x = int(x_of_centre - (width // 2)), int(x_of_centre + (width // 2))
    top_y, bottom_y = int(y_of_centre - (height // 2)), int(y_of_centre + (height // 2))

    area = 0

    for i in range(left_x, right_x):
        for j in range(top_y, bottom_y):
            if not cv2.inRange(image[j][i], black_lower, black_upper):
                area += 1

    return area

def find_damaged_pills_by_area(counting_predictions, area_threshold, image):
    ROUND_BASE = 5
    areas = list()
    areas_rounded = list()
    image = convert_b64_to_image(image)


    # Calculate mode area of counting_predictions by rounding it off
    for pill in counting_predictions:
        if pill["is_added"] or pill["is_damaged"]: continue
        
        area = calculate_area(image, pill["x"], pill["y"], pill["width"], pill["height"])

        areas.append(area)
        areas_rounded.append(ROUND_BASE * round(area / ROUND_BASE))
    
    mode = stats.mode(areas_rounded)

    for pill in counting_predictions:
        if pill["is_added"] or pill["is_damaged"]: continue

        area = calculate_area(image, pill["x"], pill["y"], pill["width"], pill["height"])
        if abs(area - mode[0]) > (0.3 * mode[0]):
            pill["is_damaged"] = True
            pill["damaged_index"] = 1
            pill["damaged_signature"] = "Area too different from the mode."