import React, { useState, useEffect } from 'react';
import Navbar from '@/components/NavBar/navbar';

interface Movie {
    movie_id: string;
    name: string;
    rating: number;
    count: number;
    visible: boolean;
    closing: boolean;
}

type UserPrefs = {
    liked_movies: Movie[];
    disliked_movies: Movie[];
}

interface Props {
    userPrefs: UserPrefs;
    setUserPrefs: React.Dispatch<React.SetStateAction<UserPrefs>>;
}

const Grid = () => {
    const num_elements: number = 10;
    let start = 0;
    const [movies, setMovies] = useState<Movie[]>([]);
    const startingPrefs: UserPrefs = {
        liked_movies: [],
        disliked_movies: [],
    }
    const [userPrefs, setUserPrefs] = useState(startingPrefs);

    const toggleMovieClosing = (movie_id: string) => setMovies(movies.map((movie) => movie.movie_id === movie_id ? { ...movie, closing: true } : movie));
    // const toggleMovieVisibility = (movie_id: string) => setMovies(movies.map((movie) => movie.movie_id === movie_id ? { ...movie, visible: false } : movie));
    const toggleMovieVisibility = (movie_id: string) => {
        setMovies(movies.filter((movie) => movie.movie_id !== movie_id));
    };


    function onThumbsDownClick(event: React.MouseEvent<HTMLDivElement>, movie_id: string): void {
        // console.log('clicked down movie ' + movie_id);
        toggleMovieClosing(movie_id);
        const movieToUpdate = movies.find((movie: Movie) => movie.movie_id == movie_id)
        if (movieToUpdate) {
            addDislikedMovie(movieToUpdate);
        }
    }

    function onThumbsUpClick(event: React.MouseEvent<HTMLDivElement>, movie_id: string): void {
        // console.log('clicked up movie ' + movie_id)
        toggleMovieClosing(movie_id);
        const movieToUpdate = movies.find((movie: Movie) => movie.movie_id == movie_id)
        if (movieToUpdate) {
            addLikedMovie(movieToUpdate);
        }
        console.log('movies = ' + movies.length);
    }

    function onNotSeenClick(event: React.MouseEvent<HTMLDivElement>, movie_id: string): void {
        // console.log('clicked not seen ' + movie_id)
        toggleMovieClosing(movie_id);
    }

    function addDislikedMovie(movie: Movie) {
        let l_m: Movie[] = userPrefs.disliked_movies;
        if (l_m.indexOf(movie) == -1) {
            l_m.push(movie);
        }
        const updatedUserPrefs: UserPrefs = {
            ...userPrefs,
            disliked_movies: l_m,
        };
        setUserPrefs(updatedUserPrefs);
        console.log(userPrefs.disliked_movies);
    }

    function addLikedMovie(movie: Movie) {
        let l_m: Movie[] = userPrefs.liked_movies;
        if (l_m.indexOf(movie) == -1) {
            l_m.push(movie);
        }
        const updatedUserPrefs: UserPrefs = {
            ...userPrefs,
            liked_movies: l_m,
        };
        setUserPrefs(updatedUserPrefs);
        console.log(userPrefs.liked_movies);
    }
    /**
     * Fetch top rated movies data from a JSON file and update the state of `movies`
     * to contain an array of movies with their movie_id, name, rating, count, and visible properties.
     */
    useEffect(() => {
        const fetchMovies = async () => {
            // Fetch data from a JSON file containing top rated movies.
            const response = await fetch('/top_rated_50.json');
            const data = await response.json();

            // Create an array of movies from the fetched data.
            const movieArray: unknown[] = Object.values(data);
            const updatedMovieArray = movieArray.map((movie: any, index) => ({
                movie_id: Object.keys(data)[index],
                name: movie.title,
                rating: movie.Rating,
                count: movie.Count,
                visible: true,
                closing: false,
            }));

            // Update the state of `movies` with the array of movies.
            setMovies(updatedMovieArray);
        };

        // Call the `fetchMovies` function when the component mounts.
        fetchMovies();
    }, []);


    let rng = Array.from({ length: num_elements - start }, (_, i) => start + i);
    return (
        <>
            <Navbar />
            {/* <h2>{movies.length} movies</h2> */}
            <div className="app-container">
                {
                    movies.map((movie: Movie, i: number) => (
                        <>
                            {movie.visible &&
                                <div key={i} className={`movie-container ${movie.closing ? "closed" : ""}`} onAnimationEnd={() => toggleMovieVisibility(movie.movie_id)} >
                                    <div className="image-container">
                                        <img
                                            src={'/' + movie.movie_id + '.jpg'}
                                            alt=""
                                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                            className="movie-image"
                                        />
                                        <div className="overlay">
                                            {movie.name}
                                            <div className="button-container">
                                                <div onClick={(e) => onThumbsDownClick(e, movie.movie_id)} className="button thumbs-down">&#128078;</div>
                                                <div onClick={(e) => onNotSeenClick(e, movie.movie_id)} className="button not-seen">👀</div>
                                                <div onClick={(e) => onThumbsUpClick(e, movie.movie_id)} className="button thumbs-up">&#128077;</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </>
                    ))
                }
            </div>
        </>
    )
}

export default Grid