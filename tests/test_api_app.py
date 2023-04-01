import requests
import unittest
from api.app import create_app


class TestApiApp(unittest.TestCase):

    @classmethod
    def setUpClass(self) -> None:
        # instantiate copy of app to run tests
        self.app = create_app()
        self.base_url = 'http://127.0.0.1:5000/api'
        print(type(self.app), self.app)
        return super().setUpClass()

    def test_movie_genre_endpoint(self):
        url = self.base_url + '/movies/1'
        res = requests.get(url, verify=False)
        print(type(res), res)
        # print(res.content.decode())
        # res_content = res.content.decode()
        # self.assertEqual(
        #     res_content, 'Adventure|Animation|Children|Comedy|Fantasy')
        self.assertEqual(res.status_code, 200)
