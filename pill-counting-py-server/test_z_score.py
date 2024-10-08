import numpy as np

def z_score_outliers(data, threshold):
    mean = np.mean(data)
    std = np.std(data)
    z_scores = [(x - mean) / std for x in data]
    outliers = [x for i, x in enumerate(data) if np.abs(z_scores[i]) > threshold]
    return outliers

print(z_score_outliers([1540.0, 1575.0, 1530.0, 1610.0, 1656.0, 1505.0, 1462.0, 1394.0, 1440.0, 1428.0, 3408.0, 1584.0, 1505.0, 828.0, 612.0, 735.0, 920.0, 805.0], 0.5))