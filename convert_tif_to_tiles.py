import os
import subprocess
import tempfile

def convert_tif_to_tiles(input_tif, output_directory):

    # Ensure the output directory exists
    os.makedirs(output_directory, exist_ok=True)

    # Create a temporary file for the `gdal_translate` output
    with tempfile.NamedTemporaryFile(suffix=".tif", delete=False) as temp_tif:
        temp_tif_path = temp_tif.name

    try:
        # Step 1: Run gdal_translate to set the 4th band as the transparency mask
        translate_command = ['gdal_translate', '-mask', '4', input_tif, temp_tif_path]
        subprocess.run(translate_command, check=True)

        # Step 2: Run gdal2tiles on the result of gdal_translate
        tiles_command = ['gdal2tiles.py', '-z', '5-10', '-v', '-r', 'bilinear', temp_tif_path, output_directory]
        subprocess.run(tiles_command, check=True)

    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")

    finally:
        # Clean up the temporary file
        os.remove(temp_tif_path)

if __name__ == "__main__":
    input_tif = "/media/maffe/nvme/iceboost_global_deploy/rgi6/mapbox/RGI60-06.00416_Mapbox.tif"
    glacier_name = input_tif.split('/')[-1].replace('.tif', '').replace('_Mapbox', '')
    output_dir = f"/home/maffe/PycharmProjects/map_glaciers/tiles/{glacier_name}/"
    convert_tif_to_tiles(input_tif, output_dir)
