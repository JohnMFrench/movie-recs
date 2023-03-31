import http from "./rest_client"

class GenreDataService {
    getGenres(movie: number) {
        return http.get('/movies/'+movie);
    }
}

export default GenreDataService;
