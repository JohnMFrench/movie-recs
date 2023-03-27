import unittest
import pandas as pd
from movie_recommender import MovieRecommender


class TestMovieRecommender(unittest.TestCase):
    def test_load_dataframes(self):
        movies_file = 'data/ml-10M100K/movies.dat'
        ratings_file = 'data/ml-10M100K/ratings.dat'
        mr = MovieRecommender(movies_filename=movies_file,
                              ratings_filename=ratings_file)

        self.assertIsInstance(mr.ratings_df, pd.DataFrame)
        self.assertIsInstance(mr.movies_df, pd.DataFrame)
        self.assertEqual(len(mr.ratings_df), 10000054)
        self.assertEqual(len(mr.movies_df), 65133)



