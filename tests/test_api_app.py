import requests
import unittest
from api.app import create_app
import sys


class TestApiApp(unittest.TestCase):

    @classmethod
    def setUpClass(self) -> None:
        # instantiate copy of app to run tests
        self.app = create_app()
        self.base_url = 'http://127.0.0.1:5000/api'
        return super().setUpClass()

    def test_movie_genre_endpoint(self):
        print('testing in test_movie_genre_endpoints')
        print(type(self.app), self.app)
        url = self.base_url + '/movies/1'
        res = requests.get(url, verify=False)
        # print(res.content.decode())
        self.assertEqual(res.status_code, 200)
