import unittest
import requests
import sys
sys.path.append("..")
from api.app import create_app


class TestApiApp(unittest.TestCase):
    def setUp(self) -> None:
        super().setUp()
        # instantiate copy of app to run tests
        self.app = create_app()
        self.base_url = 'http://localhost:5000/api'

    def test_movie_genre_endpoint(self):
        url = self.base_url + '/movies/1'
        res = requests.get(url)
        # print(res.content.decode())
        self.assertEqual(res.status_code, 200)
