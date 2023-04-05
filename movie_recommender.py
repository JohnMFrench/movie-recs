# fix from https://stackoverflow.com/a/74471578
from adjustText import adjust_text
from scipy import spatial, stats
from re import compile
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib
import os
matplotlib.use('AGG')


class MovieRecommender:
    # set static variables
    _pickle_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data\pickled')
    _pickle_filename = 'movie_ratings.pkl'
    pickle_path = os.path.join(_pickle_dir, _pickle_filename)

    def __init__(self, movies_filename, ratings_filename):
        try:
            self.movies_df = pd.read_csv(movies_filename, engine='python', encoding='utf-8',
                                         sep='::', header=None, names=['movie_id', 'name', 'genres'],
                                         index_col='movie_id', dtype={'movie_id': np.int32, 'name': np.chararray, 'genres': np.chararray})
                                        # dtype={'movie_id': np.int32, 'name': np.chararray, 'genres': np.chararray})
            # load ratings df from pickle if it exists
            print(f'testing {self.pickle_path}')
            if os.path.exists(self.pickle_path):
                print(f'found pickle at {self.pickle_path}')
                self.ratings_df = pd.read_pickle(self.pickle_path)
            else:
                print(f'no pickle found at {self.pickle_path}, loading from csv')
                self.ratings_df = pd.read_csv(ratings_filename, engine='python', encoding='utf-8',
                                            sep='::', header=None, names=['user_id', 'movie_id', 'rating', 'timestamp'],
                                            index_col='movie_id', dtype={'user_id': np.int32, 'movie_id': np.int32, 'rating': np.int32, 'timestamp': np.float64})
                                            # dtype={'user_id': np.int32, 'movie_id': np.int32, 'rating': np.int32, 'timestamp': np.float64})
        except Exception as e:
            print(f'Error occured while instantiating datafarmes: {e}')

        # join the two dataframes and group to determine metadata
        self.grouped_df = self.movies_df.join(self.ratings_df, on='movie_id').groupby(
            'name').agg({'rating': ['mean', 'count']})
        self.grouped_df['AvgRating'] = self.grouped_df[('rating', 'mean')]
        self.grouped_df['Count'] = self.grouped_df[('rating', 'count')]

        rating_count_mean = self.grouped_df.agg({('rating', 'count'): 'mean'})
        rating_count_std = self.grouped_df.std()[('rating', 'count')]

        two_zscore = float(rating_count_mean + (2*rating_count_std))
        self.top_rated_movies = self.grouped_df[self.grouped_df['Count'] > two_zscore]

        # create a df to be used for KNN alg per demo
        # https://github.com/rposhala/Recommender-System-on-MovieLens-dataset
        no_index_movies = self.movies_df.reset_index()

        # merge dataframes
        self.merged = pd.merge(self.ratings_df, no_index_movies, how="inner", on="movie_id")
        self.merged.drop(['timestamp', 'name', 'genres'], axis=1, inplace=True)
        print(self.merged.head())

        # create [len(users) x len(movies)] dimensioned matrix
        self.mrm_df = self.merged.pivot(
            index='user_id',
            columns='movie_id',
            values='rating',
        ).fillna(0)
        self.mrm_df.head()
        
        # self.mrm_df = pd.DataFrame(index=self.merged.index, columns=self.merged.movie_id.values[:100])
        print(self.mrm_df)

    def add_movie_rating(self, movie_id, user_id, rating):
        # Create a new dataframe with the new rating information
        new_rating_df = pd.DataFrame({'user_id': [np.int32(user_id)],
                                      'movie_id': [np.int32(movie_id)],
                                      'rating': [np.int32(rating)],
                                      'timestamp': [np.float64(0)]})
        new_rating_df.set_index('movie_id', inplace=True)
        if self.ratings_df.loc[(self.ratings_df.index == movie_id) & (self.ratings_df.user_id == user_id)].values.any():
            print(f'ENDING add_movie_rating() to prevent {movie_id} review added twice for {user_id}')
            return 

        # concatenate the new rating to ratings_df
        self.ratings_df = pd.concat(
            [self.ratings_df, new_rating_df], ignore_index=False)

        # TODO this metadata should be taken out or used
        # recalculate the metadata for the movies
        self.grouped_df = self.movies_df.join(self.ratings_df, on='movie_id').groupby(
            'name').agg({'rating': ['mean', 'count']})
        self.grouped_df['AvgRating'] = self.grouped_df[('rating', 'mean')]
        self.grouped_df['Count'] = self.grouped_df[('rating', 'count')]

        # update aggregations
        rating_count_mean = self.grouped_df.agg({('rating', 'count'): 'mean'})
        rating_count_std = self.grouped_df.std()[('rating', 'count')]
        two_zscore = rating_count_mean + (2*rating_count_std)
        # refilter based on new zscore
        self.top_rated_movies = self.grouped_df[self.grouped_df['Count'] > float(
            two_zscore)]

    # returns an array of the movie_id for all movies user has rated
    def get_user_movies(self, user_id: int):
        return set([int(x) for x in self.ratings_df[self.ratings_df['user_id'] == user_id].index])

    def get_movie_users(self, movie_id: int):
        return set([int(x) for x in self.ratings_df[self.ratings_df.index == movie_id]['user_id'].values])

    def get_common_movies(self, user_id1: int, user_id2: int):
        user1_movies = set(self.get_user_movies(user_id1))
        user2_movies = set(self.get_user_movies(user_id2))
        return user1_movies.intersection(user2_movies)

    def get_common_users(self, movie1_id: int, movie2_id: int):
        movie1_users = self.get_movie_users(movie1_id)
        movie2_users = self.get_movie_users(movie2_id)
        return movie1_users.intersection(movie2_users)

    def get_movie_num_ratings(self, movie_id: int):
        return self.grouped_df[self.grouped_df.index == movie_id]['Count']

    def get_movie_title_with_year(self, movie_id: int) -> str:
        return str(self.movies_df[self.movies_df.index == movie_id]['name'].values[0])

    def get_movie_title(self, movie_id: int):
        raw_string = self.get_movie_title_with_year(movie_id=movie_id)
        pattern = compile(r'\s*\(\d{4}\)\s*')
        return pattern.sub('', raw_string)

    def get_movie_genres(self, movie_id: int):
        return str(self.movies_df[self.movies_df.index == movie_id]['genres'].values[0])

    def get_next_avail_user_id(self):
        return self.ratings_df['user_id'].max() + 1

    def get_user_movie_rating(self, user_id: int, movie_id: int):
        return int(self.ratings_df.loc[(self.ratings_df['user_id'] == user_id) & (self.ratings_df.index == movie_id), 'rating'])

    def get_user_similarity_score(self, user1_id: int, user2_id: int):
        common_movies = self.get_common_movies(user1_id, user2_id)
        min_common_movies = 2
        # check if the users have no movies in common
        if len(common_movies) < min_common_movies:
            # if they have no common movies, similarity defaults to zero
            # print(f'{user1_id} and {user2_id} have no movie ratings in common')
            return 0.0
        user1_ratings = [self.get_user_movie_rating(
            int(user1_id), movie_id) for movie_id in common_movies]
        user2_ratings = [self.get_user_movie_rating(
            int(user2_id), movie_id) for movie_id in common_movies]
        error_in_common_movies = spatial.distance.euclidean(
            user1_ratings, user2_ratings)
        similarity_score = 1 / (1 + error_in_common_movies)
        # print(
        #     f'Found similarity of {similarity_score} based on {len(common_movies)} in common')
        return similarity_score

    def get_movie_recommendation(self, user1_id: int, user2_id: int) -> int:
        common_movies = self.get_common_movies(user1_id, user2_id)
        movies_no_user1_rating = self.get_user_movies(user2_id) - common_movies
        movie_id_rating_pairs = [(movie_id, self.get_user_movie_rating(
            user2_id, movie_id)) for movie_id in movies_no_user1_rating]
        # sort by ratings
        movie_id_rating_pairs.sort(key=lambda pair: pair[1], reverse=True)
        return movie_id_rating_pairs

    def get_most_similar_user(self, user_id: int):
        print('called get_most_similar_user')
        comparisons = 0
        max_comparisons = 200
        most_similar_user = None
        most_similar_score = float(0)
        for id in self.ratings_df['user_id'].unique():
            # print(f'comparing similarity of {user_id} and {id}')
            similarity = self.get_user_similarity_score(user_id, id)
            # print('found similarity of ' + str(similarity))
            if similarity != None and user_id != id:
                if similarity > most_similar_score:
                    if similarity == float(1) and len(self.get_common_movies(user_id, id)) < 4:
                        comparisons += 1
                        continue
                    most_similar_user = id
                    most_similar_score = similarity
                    # print(
                    #     f'updated most similar ({most_similar_user} with score of {most_similar_score})')
            comparisons += 1
            if comparisons >= max_comparisons:
                return most_similar_user
        return most_similar_user

    def get_naive_recommendation(self, user_id: int):
        user2_id = self.get_most_similar_user(user_id)
        print(f'found similar user of {user2_id}')
        recs = self.get_movie_recommendation(user_id, user2_id)
        for rec in recs:
            print(self.get_movie_title(rec[0]))
        return recs

    def get_movie_rating_count_percentile(self, movie_id: int):
        movie_name = self.get_movie_title(movie_id)
        movie_num_ratings = self.grouped_df[self.grouped_df.index ==
                                            movie_name]['Count']
        percentile = stats.percentileofscore(
            self.grouped_df['Count'], movie_num_ratings)

        print(
            f'{movie_name} has been rated {int(movie_num_ratings)} times, placing it in the {percentile[0]}th percentile')
        return percentile

    def plot_users_ratings(self, user1_id: int, user2_id: int) -> None:
        common_movies = self.get_common_movies(user1_id, user2_id)
        user_1_ratings = [self.get_user_movie_rating(
            user1_id, m) for m in common_movies]
        user_2_ratings = [self.get_user_movie_rating(
            user2_id, m) for m in common_movies]
        movie_titles = [self.get_movie_title(
            movie_id) for movie_id in common_movies]
        new_data = {
            'titles': movie_titles,
            'user1_ratings': user_1_ratings,
            'user2_ratings': user_2_ratings,
        }
        fig, ax = plt.subplots()

        # ax.scatter(user_1_ratings, user_2_ratings)

        users_common_ratings_df = pd.DataFrame(data=new_data)
        ax = users_common_ratings_df.plot.scatter(
            x='user1_ratings', y='user2_ratings')

        texts = []

        for i, title in enumerate(movie_titles):
            texts.append(ax.text(user_1_ratings[i], user_2_ratings[i], title))

        # adjust_text(texts)
        ax.set_xlim(0.25, 5.25)
        ax.set_ylim(0.25, 5.25)
        ax.plot()

    def get_movie_similarity(self, movie1_id: int, movie2_id: int) -> float:
        movie1_ratings = self.ratings_df.loc[self.ratings_df.index ==
                                             movie1_id]['rating']
        print(movie1_ratings.values)
        return float(0)

    def metadata_to_json(self, output_file='recs-app/public/top_rated_movies30.json') -> None:
        self.top_rated_movies.sort_values(
            by='Count', ascending=False, inplace=True)
        top_rated_movies_names = self.top_rated_movies.index.values
        self.top_rated_movies_slice = self.top_rated_movies.head(10)
        self.top_rated_movies_slice.columns = self.top_rated_movies_slice.columns.get_level_values(
            0)

    def data_to_bin(self) -> None:
        try:
            self.ratings_df.to_pickle(self.pickle_dir + self.pickle_filename)
        except Exception as e:
            print(f'Error occured while trying to pickle: {e}')

# for quick testing
# TODO take this out
movies_file = 'data/ml-10M100K/movies.dat'
ratings_file = 'data/ml-10M100K/ratings.dat'
mr = MovieRecommender(movies_filename=movies_file, ratings_filename=ratings_file)


