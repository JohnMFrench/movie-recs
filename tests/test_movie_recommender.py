import unittest
import pandas as pd
from movie_recommender import MovieRecommender


class TestMovieRecommender(unittest.TestCase):
    def test_load_dataframes(self):
        movies_file = 'data/ml-10M100K/movies.dat'
        ratings_file = 'data/ml-10M100K/ratings.dat'

        # figures for testing from kaggle
        # https://www.kaggle.com/datasets/amirmotefaker/movielens-10m-dataset-latest-version
        num_ratings = 10000054
        num_tags = 95580
        num_movies = 10681
        num_users = 71567

        mr = MovieRecommender(movies_filename=movies_file,
                              ratings_filename=ratings_file)

        self.assertIsInstance(mr.ratings_df, pd.DataFrame)
        self.assertIsInstance(mr.movies_df, pd.DataFrame)
        self.assertEqual(len(mr.ratings_df), num_ratings)
        self.assertEqual(len(mr.movies_df), num_movies)
