# Movie Recommendations
This is an app that will generate movie recommendations.

## Testing
![CI/CD Tests](https://github.com/johnmfrench/movie-recs/actions/workflows/tests.yml/badge.svg)

## EDA Notes
- one movie has no genre
- some user_id values are missing

## TODO
- incorporate [scikit-surprise](https://surpriselib.com/) into a MovieRecommender.recommend() implementation
- create a similiarity matrix of movie coefficient scores to apply some heuristic to algorithm
- figure out how to generate matplotlib graphs in response to api requests, store in mem only
- add columns to the joined_df for each genres
- setup CI/CD pipeline to prevent deploying to vercel if unit tests fail
- create ServerStatus component
- add ratings and rebuild model
- Create better dataframe for matrix calculations
    - fold in duplicate ratings for users by averaging
    - create columns for each genre