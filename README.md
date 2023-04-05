# Movie Recommendations
This is an app that will generate movie recommendations.

## Testing
![CI/CD Tests](https://github.com/johnmfrench/movie-recs/actions/workflows/tests.yml/badge.svg)

## TODO
- incorporate [scikit-surprise](https://surpriselib.com/) into a MovieRecommender.recommend() implementation
- ~~find a way to pull movie posters for the front-end~~
- create a similiarity matrix of movie coefficient scores to apply some heuristic to algorithm
- ~~create a flask api to serve responses to requests from front-end~~
- ~~fix issue where Toast keeps popping up when user scrolls page~~
- figure out how to generate matplotlib graphs in response to api requests, store in mem only
- add columns to the joined_df for each genres
- ~~setup CI/CD with github workflows~~
- add media queries to the components that lack them
- setup CI/CD pipeline to prevent deploying to vercel if unit tests fail
- create ServerStatus component