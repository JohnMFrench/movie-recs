import unittest
import pandas as pd
import os

from movie_recommender import MovieRecommender


class TestMovieRecommender(unittest.TestCase):
    dir_path = os.path.abspath(os.path.dirname(__file__))
    movies_file = os.path.join(dir_path, '..', 'data', 'ml-10M100K', 'movies.dat')
    ratings_file = os.path.join(dir_path, '..', 'data', 'ml-10M100K', 'ratings.dat')

    @classmethod
    def setUpClass(self) -> None:
        self.mr = MovieRecommender(movies_filename=TestMovieRecommender.movies_file,
                                   ratings_filename=TestMovieRecommender.ratings_file)
        return super().setUpClass()

    def test_load_dataframes(self):
        # figures for testing from kaggle
        # https://www.kaggle.com/datasets/amirmotefaker/movielens-10m-dataset-latest-version
        num_ratings = 10000054
        num_tags = 95580
        num_movies = 10681
        num_users = 71567

        self.assertIsInstance(self.mr.ratings_df, pd.DataFrame)
        self.assertIsInstance(self.mr.movies_df, pd.DataFrame)
        self.assertEqual(len(self.mr.ratings_df), num_ratings)
        self.assertEqual(len(self.mr.movies_df), num_movies)

    def test_get_movie_title(self):
        t = self.mr.get_movie_title(1)
        expected_name = 'Toy Story'
        self.assertEqual(t, expected_name)

    def test_get_movie_title_with_year(self):
        t = self.mr.get_movie_title_with_year(1)
        expected_name = 'Toy Story (1995)'
        self.assertEqual(t, expected_name)

    def test_get_movie_genres(self):
        g = self.mr.get_movie_genres(1)
        expected_genres = 'Adventure|Animation|Children|Comedy|Fantasy'
        self.assertEqual(g, expected_genres)