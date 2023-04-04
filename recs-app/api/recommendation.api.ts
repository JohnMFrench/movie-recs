import http from "./rest_client";
import Movie from "@/components/MovieContainer/movie.type";

// class RecommendationDataService {
//   getRecommendation(user: string, movies: Movie[]) {
//     let movieObjs:any = {}
//     const movie_ids:any = movies.map((movie) => ( movie.movie_id ));
//     const ratings:any = movies.map((movie) => ( 5 ));
//     movieObjs.user_id = user;
//     movieObjs.movie_id = movie_ids;
//     movieObjs.rating = ratings;
//     console.log("movieObs equal to");
//     console.log(movieObjs);
//     return http.post('/ratings', movieObjs);
//   }
// }

class RecommendationDataService {
  async getMostSimilarUser(user: string, movies: Movie[]) {
    try {
      let movieObjs:any = {}
      const movie_ids:any = movies.map((movie) => ( movie.movie_id ));
      const ratings:any = movies.map((movie) => ( 5 ));
      movieObjs.user_id = user;
      movieObjs.movie_id = movie_ids;
      movieObjs.rating = ratings;
      console.log("movieObs equal to");
      console.log(movieObjs);
      const response = await http.post('/ratings', movieObjs);
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Error getting recommendation");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error getting recommendation");
    }
  }
}

export default RecommendationDataService;