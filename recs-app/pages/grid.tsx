import React, { useState, useEffect } from 'react';
import Navbar from '@/components/NavBar/navbar';

interface Movie {
    movie_id: string;
    name: string;
    rating: number;
    count: number;
    visible: boolean;
}

const Grid = () => {
    const num_elements: number = 10;
    let start = 0;
    const [movies, setMovies] = useState<Movie[]>([]);

    /**
     * Update the visibility of a movie with the given ID to false.
     * @param movie_id The ID of the movie to update.
    */
    function toggleMovieVisibility(movie_id: string) {
        const updatedMovies = movies.map((movie) => {
            if (movie.movie_id === movie_id) {
                return { ...movie, visible: false };
            } else {
                return movie;
            }
        });
        setMovies(updatedMovies);
    }

    function onThumbsDownClick(event: React.MouseEvent<HTMLDivElement>, movie_id: string): void {
        console.log('clicked down movie ' + movie_id);
        toggleMovieVisibility(movie_id);
    }

    function onThumbsUpClick(event: React.MouseEvent<HTMLDivElement>, movie_id: string): void {
        console.log('clicked up movie ' + movie_id)
        toggleMovieVisibility(movie_id);
    }

    function onNotSeenClick(event: React.MouseEvent<HTMLDivElement>, movie_id: string): void {
        console.log('clicked not seen ' + movie_id)
        toggleMovieVisibility(movie_id);
    }

    /**
     * Fetch top rated movies data from a JSON file and update the state of `movies`
     * to contain an array of movies with their movie_id, name, rating, count, and visible properties.
     */
    useEffect(() => {
        const fetchMovies = async () => {
            // Fetch data from a JSON file containing top rated movies.
            const response = await fetch('/top_rated_movies30.json');
            const data = await response.json();

            // Create an array of movies from the fetched data.
            const movieArray: unknown[] = Object.values(data);
            const updatedMovieArray = movieArray.map((movie: any, index) => ({
                movie_id: Object.keys(data)[index],
                name: movie.title,
                rating: movie.Rating,
                count: movie.Count,
                visible: true,
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
                                <div key={i} className="movie-container">
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