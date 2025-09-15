import os, json, gzip
import numpy as np
import pandas as pd
import geopandas as gpd
from oggm import utils

###### IMPORTANT HERE: DECIDE WHAT VERSION YOU WANT TO CREATE
version = '62'

if version not in ('62', '70G'): raise ValueError("Accepted RGI versions are 62 or 70G. Exit.")
if version == '62': name_column_id = 'RGIId'
elif version == '70G': name_column_id = 'rgi_id'

all_world_glaciers = []
decimal_places = 4

for rgi in np.arange(1, 20):
    print(rgi)
    if not isinstance(rgi, str): rgi = f"{rgi:02d}"

    # get rgi region and intersect shp files
    # get rgi dataset of glaciers and glaciers intersects
    FILE_RGI_SHP = utils.get_rgi_region_file(rgi, version=version)
    rgi_glaciers = gpd.read_file(FILE_RGI_SHP, engine='pyogrio')

    for idx, row in rgi_glaciers.iterrows():
        id = row[name_column_id]
        geom = row['geometry']
        bbox = geom.bounds
        cenLon, cenLat = geom.centroid.x, geom.centroid.y

        # Round the bounding box values to the desired number of decimal places
        rounded_bbox = [round(coord, decimal_places) for coord in bbox]
        rounded_center = [round(coord, decimal_places) for coord in (cenLon, cenLat)]

        TARGET_LOOKUP_PATH = f"/media/maffe/nvme/iceboost_webapp_tiles/RGI{version}/{id}"

        is_tile = os.path.isdir(TARGET_LOOKUP_PATH)

        #print(cenLon, cenLat)
        #print(rounded_bbox)
        #print(rounded_center)
        #input('wait')

        # Create a dictionary entry for this glacier
        glacier_entry = {
            'id': id,
            'bbox': rounded_bbox,  # Convert tuple to list for JSON serialization
            #'center': rounded_center  # Convert tuple to list for JSON serialization
            "is_tile": is_tile
        }

        #if ((id == 'RGI60-06.00416') or (id == 'RGI60-06.00475') or (id == 'RGI60-11.01450')):
        all_world_glaciers.append(glacier_entry)

print(f"Fetched all glacier names: {len(all_world_glaciers)}")

# Create a dictionary to hold the glacier IDs
output_json = {"glaciers": all_world_glaciers}

# Specify the path to save the JSON file
json_file_path = f'tileFolders_RGI{version}_with_bbox.json.gz'


# Write the data to a gzipped JSON file
with gzip.open(json_file_path, 'wt', encoding='utf-8') as json_file:
    json.dump(output_json, json_file)

print(f"Version {version}: Gzipped JSON file {json_file_path} created successfully.")