import requests
import unittest
from api.app import create_app
import sys
print(sys.path)


class TestApiApp(unittest.TestCase):

    @classmethod
    def setUpClass(self) -> None:
        # instantiate copy of app to run tests
        self.app = create_app()
        self.base_url = 'http://localhost:5000/api'
        return super().setUpClass()

    def test_movie_genre_endpoint(self):
        url = self.base_url + '/movies/1'
        res = requests.get(url)
        # print(res.content.decode())
        self.assertEqual(res.status_code, 200)
