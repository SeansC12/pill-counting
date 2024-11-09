from scipy import ndimage
import cv2
import numpy as np
from helpers import convert_b64_to_image

# initialise upper and lower bound for white
white_lower = np.array([200, 200, 200])
white_upper = np.array([255, 255, 255])

#initialisie upper and lower bound for black
black_lower = np.array([0, 0, 0])
black_upper = np.array([70, 70, 70]) # only very high because the dark background is very light

def crop_image(image, x_of_centre, y_of_centre, width, height):
    left_x, right_x = int(x_of_centre - (width // 2)), int(x_of_centre + (width // 2))
    top_y, bottom_y = int(y_of_centre - (height // 2)), int(y_of_centre + (height // 2))
    return image[top_y:bottom_y, left_x:right_x]

def calculate_area(image):
    cropped_image = image

    brightness = 100
    contrast = 100
    cropped_image = np.int16(cropped_image)
    cropped_image = cropped_image * (contrast/127+1) - contrast + brightness
    cropped_image = np.clip(cropped_image, 0, 255)
    cropped_image = np.uint8(cropped_image)

    cropped_image = cv2.fastNlMeansDenoisingColored(cropped_image, None, 10, 10, 7, 21)

    # cropped_image = np.hstack((cropped_image, sharpen_image(cropped_image)))

    gray = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Step 2: Morphological Operations (Opening - Erosion followed by Dilation)
    # kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 3))
    kernel = np.ones((3, 1), np.uint8)
    eroded = cv2.erode(thresh, kernel, iterations=2)
    dilated = cv2.dilate(eroded, kernel, iterations=3)

    # Step 3: Distance Transform
    dist_transform = cv2.distanceTransform(dilated, cv2.DIST_L2, 5)
    dist_transform = cv2.normalize(dist_transform, None, 0, 1.0, cv2.NORM_MINMAX)

    # Thresholding the distance transform to get the foreground (capsule centers)
    _, sure_fg = cv2.threshold(dist_transform, 0.5, 1.0, 0)
    sure_fg = np.uint8(sure_fg)

    # Step 4: Watershed Algorithm
    unknown = cv2.subtract(dilated, sure_fg)
    _, markers = cv2.connectedComponents(sure_fg)
    markers = markers + 1  # Ensure background is labeled as 1
    markers[unknown == 255] = 0


    # Apply the Watershed algorithm
    colored_image = cv2.cvtColor(thresh, cv2.COLOR_GRAY2BGR)
    markers = cv2.watershed(colored_image, markers)

    test_img = colored_image.copy()
    test_img[markers == -1] = [255, 0, 0]
    cv2.imwrite("watershed.jpg", test_img)

    # Step 5: Find the area of each capsule
    unique_labels = np.unique(markers)
    capsule_areas = []

    for label in unique_labels:
        if label > 1:  # Skip background (1) and borders (-1)
            # Create a mask for the current label
            capsule_mask = np.uint8(markers == label)
            # Calculate the area as the number of pixels in the mask
            area = cv2.countNonZero(capsule_mask)
            capsule_areas.append(area)

    if capsule_areas:
        return max(capsule_areas)
    else:
        return 0

def find_damaged_pills_by_area(counting_predictions, area_threshold, image):
    ROUND_BASE = 5
    areas = list()
    areas_rounded = list()
    image = convert_b64_to_image(image)
 
    # Calculate mode area of counting_predictions by rounding it off
    for pill in counting_predictions:
        if pill["is_added"] or pill["is_damaged"]: continue
        
        cropped_image = crop_image(image, pill["x"], pill["y"], pill["width"], pill["height"])
        area = calculate_area(cropped_image)
        areas.append(area)
        areas_rounded.append(ROUND_BASE * round(area / ROUND_BASE))
    
    print(areas)

    median = np.median(areas_rounded)

    for pill in counting_predictions:
        if pill["is_added"] or pill["is_damaged"]: continue

        cropped_image = crop_image(image, pill["x"], pill["y"], pill["width"], pill["height"])
        area = calculate_area(cropped_image)
        if abs(area - median) > (0.35 * median):
            cropped_image = crop_image(image, pill["x"], pill["y"], pill["width"], pill["height"])

            angle = np.arctan2(pill["height"], pill["width"])
            # Rotate the image such that the capsule is horizontal or vertical
            cropped_image = ndimage.rotate(cropped_image, angle * 180 / np.pi)

            area = calculate_area(cropped_image)
            cv2.imwrite("area_not_working.jpg", cropped_image)
            
            if abs(area - median) > (0.35 * median):
                pill["is_damaged"] = True
                pill["damaged_index"] = 1
                pill["damaged_signature"] = "Area too different from the mode."