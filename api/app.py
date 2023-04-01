import sys
import os
from flask_cors import CORS
# sys.path.append("..")

from flask import Flask, request, jsonify
from movie_recommender import MovieRecommender

def create_app():
    app = Flask(__name__)
    CORS(app)

    project_dir = os.path.abspath(os.path.dirname(__file__))
    movies_file = os.path.join(project_dir, '../data/ml-10M100K/movies.dat')
    ratings_file = os.path.join(project_dir, '../data/ml-10M100K/ratings.dat')
    # movies_file = '../data/ml-10M100K/movies.dat'
    # ratings_file = '../data/ml-10M100K/ratings.dat'
    movie_rec = MovieRecommender(movies_filename=movies_file, ratings_filename=ratings_file)

    @app.route('/api', methods=['GET'])
    def get_api_index():
        return jsonify({'test':'json'})

    @app.route('/api/movies/<movie_id>', methods=['GET'])
    def get_movie(movie_id):
        print(movie_id)
        movie_genres = movie_rec.movies_df[movie_rec.movies_df.index == int(movie_id)]['genres'].values[0]
        print(movie_genres)

        return movie_genres
        # return jsonify(movie_rec.movies_df[movie_rec.movies_df.index == movie_id]['genres'].values[0])

    @app.route('/api/recommend', methods=['POST'])
    def upload_json():
        if request.method == 'POST':
            # Retrieve the JSON file from the POST request
            json_file = request.get_json()

            # Do something with the JSON file
            # For example, print the JSON file to the console
            print(json_file)

            # Return a JSON response indicating success
            return jsonify({'message': 'JSON file uploaded successfully'})

    return app