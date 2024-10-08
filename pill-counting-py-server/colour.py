import numpy as np
import cv2
from scipy import stats
from helpers import convert_b64_to_image

ROUND_BASE = 5

# initialise upper and lower bound for white
white_lower = np.array([200, 200, 200])
white_upper = np.array([255, 255, 255])

#initialisie upper and lower bound for black
black_lower = np.array([0, 0, 0])
black_upper = np.array([55, 55, 55])

def find_damaged_pills_by_colour(counting_predictions, img):
    red_rounded = list()
    green_rounded = list()
    blue_rounded = list()

    image = convert_b64_to_image(img)

    for pill in counting_predictions:
        if pill["is_damaged"] or pill["is_added"]: continue
        # initializing inputs and setting of variables
        x_of_centre, y_of_centre, width, height = pill["x"], pill["y"], pill["width"], pill["height"]
        
        left_x, right_x = int(x_of_centre - (width // 2)), int(x_of_centre + (width // 2))
        top_y, bottom_y = int(y_of_centre - (height // 2)), int(y_of_centre + (height // 2))

        red_arr, green_arr, blue_arr = list(), list(), list()

        for i in range(left_x, right_x):
            for j in range(top_y, bottom_y):
                red_arr.append(image[j][i][0])
                green_arr.append(image[j][i][1])
                blue_arr.append(image[j][i][2])
        
        red = sum(red_arr) // len(red_arr)
        green = sum(green_arr) // len(green_arr)
        blue = sum(blue_arr) // len(blue_arr)

        red_rounded.append(ROUND_BASE * round(red / ROUND_BASE))
        green_rounded.append(ROUND_BASE * round(green / ROUND_BASE))
        blue_rounded.append(ROUND_BASE * round(blue / ROUND_BASE))
    
        r_mode = stats.mode(red_rounded)
        g_mode = stats.mode(green_rounded)
        b_mode = stats.mode(blue_rounded)

    index = 0
    for _, pill in enumerate(counting_predictions):
        if pill["is_added"] or pill["is_damaged"]: continue
        red_r = red_rounded[index]
        green_r = green_rounded[index]
        blue_r = blue_rounded[index]
        index += 1

        if abs(red_r - r_mode[0]) > (0.3 * r_mode[0]) or abs(green_r - g_mode[0]) > (0.3 * g_mode[0]) or abs(blue_r - b_mode[0]) > (0.3 * b_mode[0]):
            pill["is_damaged"] = True
            pill["damaged_index"] = 2
            pill["damaged_signature"] = "Color too different from the mode."