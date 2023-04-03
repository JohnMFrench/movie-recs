from flask import Flask, request, jsonify
import matplotlib.pyplot as plt
import sys
import io
import os
from flask import make_response
from flask_cors import CORS

# fix from https://stackoverflow.com/a/74471578
import matplotlib
matplotlib.use('AGG')

sys.path.append("..")
from movie_recommender import MovieRecommender


def create_app():
    app = Flask(__name__)
    CORS(app)

    # import the files relative to the api subdir
    project_dir = os.path.abspath(os.path.dirname(__file__))
    movies_file = os.path.join(project_dir, '../data/ml-10M100K/movies.dat')
    ratings_file = os.path.join(project_dir, '../data/ml-10M100K/ratings.dat')

    # instantiate recommender class to be used by api
    movie_rec = MovieRecommender(
        movies_filename=movies_file, ratings_filename=ratings_file)

    @app.route('/api', methods=['GET'])
    def get_api_index():
        return jsonify({'test': 'json'})

    @app.route('/api/movies/<movie_id>', methods=['GET'])
    def get_movie(movie_id):
        print(movie_id)
        movie_genres = movie_rec.movies_df[movie_rec.movies_df.index == int(
            movie_id)]['genres'].values[0]
        print(movie_genres)

        return movie_genres

    @app.route('/api/user', methods=['GET'])
    def get_next_avail_user_id():
        next_avail = movie_rec.get_next_avail_user_id()
        return str(next_avail)

    @app.route('/api/compare/<user1_id>/<user2_id>', methods=['GET'])
    def get_user_ratings_plot(user1_id, user2_id):
        print(f'get_user_ratings_plot received {user1_id} and {user2_id}')

        fig = movie_rec.plot_users_ratings(
            user1_id=int(user1_id), user2_id=int(user2_id))

        # create canvas object
        canvas = plt.get_current_fig_manager().canvas
        # create a response object and add the canvas image data to it
        img_data = io.BytesIO()
        canvas.print_png(img_data)
        response = make_response(img_data.getvalue())
        response.headers['Content-Type'] = 'image/png'

        return response

    # add one or a number of ratings
    @app.route('/api/ratings', methods=['POST'])
    def add_rating():
        data = request.get_json()
        user_id = int(data.get('user_id'))

        # movie_id may be a single or list
        movie_id = data.get('movie_id')
        # rating may be a single or list
        rating = data.get('rating')

        if len(movie_id) == 1:
            # add the rating to the movie recommender
            movie_rec.add_movie_rating(
                movie_id=movie_id, user_id=user_id, rating=rating)
        else:
            movie_rating_pairs = zip(movie_id, rating)
            for pair in movie_rating_pairs:
                movie_rec.add_movie_rating(
                    movie_id=pair[0], user_id=user_id, rating=pair[1])
            # movie_rec.get_most_similar_user()
            user = movie_rec.get_most_similar_user(user_id)
            # recs = movie_rec.get_naive_recommendation(user_id)
            # get_user_ratings_plot(user_id, 5)
            print(f'received {len(movie_id)} movies')
            print(f'lookin gat user {user_id} similar to {user}')
            return jsonify({'user': user})

        return jsonify({'message': 'Rating added successfully'})

    # NOTE none of the code below has been tested
    @app.route('/api/recommend', methods=['POST'])
    def upload_json():
        if request.method == 'POST':
            # Retrieve the JSON file from the POST request
            json_file = request.get_json()

            # Return a JSON response indicating success
            return jsonify({'message': 'JSON file uploaded successfully'})

    return app
