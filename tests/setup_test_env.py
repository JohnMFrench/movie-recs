from os.path import join, isfile, exists
from os import rename, remove
import zipfile
import urllib.request
import shutil

DATA_DIR = 'data/ml-10M100K'
REQUIRED_FILES = ['movies.dat', 'ratings.dat']
ZIP_URL = 'https://files.grouplens.org/datasets/movielens/ml-10m.zip'
ZIP_FOLDERNAME = 'ml-10M100K'
ZIP_FILENAME = 'ml-10m.zip'

files_missing = False
for file_name in REQUIRED_FILES:
    file_path = join(DATA_DIR, file_name)
    if not isfile(file_path):
        files_missing = True
if files_missing:

    zip_path = join(DATA_DIR, ZIP_FILENAME)
    urllib.request.urlretrieve(ZIP_URL, zip_path)
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(DATA_DIR)
    source_folder = join(DATA_DIR, ZIP_FOLDERNAME)
    for file_name in REQUIRED_FILES:
        source_file = join(source_folder, file_name)
        dest_file = join(DATA_DIR, file_name)
        if not isfile(dest_file):
            rename(source_file, dest_file)
    if exists(zip_path):
        remove(zip_path)
    if exists(source_folder):
        shutil.rmtree(source_folder)

else:
    print('files were detected')
    # print(REQUIRED_FILES.join(', ')+' were detected in '+DATA_DIR)


