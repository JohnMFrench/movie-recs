# from app import create_app
from os import path
import sys
ROOT_DIR = path.dirname(path.abspath(__file__))
sys.path.append(ROOT_DIR)

from .app import create_app
