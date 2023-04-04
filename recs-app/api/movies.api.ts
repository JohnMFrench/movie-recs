import http from "./rest_client";
import Movie from "@/components/MovieContainer/movie.type";

class GenreDataService {
  getGenres(movie: number) {
    return http.get("/movies/" + movie);
  }
}
export default GenreDataService;