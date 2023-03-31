import React, { useState, useEffect, SyntheticEvent } from 'react';
import HelpBar from '@/components/HelpBar/helpbar.component';
import Navbar from '@/components/NavBar/navbar.component';
import ButtonContainer from '@/components/ButtonContainer/button_container.component';
import Toast from '@/components/Toast/toast.component';
import Modal from '@/components/Modal/modal.component';
import Movie from '@/components/MovieContainer/movie.type';
import MovieContainer from '@/components/MovieContainer/movie_container.component';

type UserPrefs = {
    liked_movies: Movie[];
    disliked_movies: Movie[];
}

interface Props {
    userPrefs: UserPrefs;
    setUserPrefs: React.Dispatch<React.SetStateAction<UserPrefs>>;
}

const Grid = () => {
    const defaultMoviesShown: number = 20
    const [movies, setMovies] = useState<Movie[]>([]);
    const startingPrefs: UserPrefs = {
        liked_movies: [],
        disliked_movies: [],
    }
    const [userPrefs, setUserPrefs] = useState(startingPrefs);
    const [moviesShown, setMoviesShown] = useState(defaultMoviesShown);
    const [toastMessage, setToastMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    type movieOrNull = Movie | null;
    const [modalFocusedMovie, setModalFocusedMovie] = useState<movieOrNull>(null);

    const toggleMovieClosing = (movie_id: string) => setMovies(movies.map((movie) => movie.movie_id === movie_id ? { ...movie, closing: true } : movie));
    // const toggleMovieVisibility = (movie_id: string) => setMovies(movies.map((movie) => movie.movie_id === movie_id ? { ...movie, visible: false } : movie));
    const toggleMovieVisibility = (movie_id: string) => {
        setMovies(movies.filter((movie) => movie.movie_id !== movie_id));
    };

    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
        const imgElement = event.currentTarget;
        imgElement.style.display = 'none';
    }

    function onThumbsDownClick(event: React.MouseEvent<HTMLDivElement>, movie_id: string): void {
        // console.log('clicked down movie ' + movie_id);
        toggleMovieClosing(movie_id);
        const movieToUpdate = movies.find((movie: Movie) => movie.movie_id == movie_id)
        if (movieToUpdate) {
            addDislikedMovie(movieToUpdate);
        }
    }

    function updateToastMessage() {
        const numMoviesLiked: number = userPrefs.liked_movies.length + userPrefs.disliked_movies.length;
        setToastMessage(numMoviesLiked + ' movies rated');
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
        //push this disliked movie to the array of liked_movies
        // in userPrefs if it not already in
        let l_m: Movie[] = userPrefs.disliked_movies;
        if (l_m.indexOf(movie) == -1) {
            l_m.push(movie);
        }
        const updatedUserPrefs: UserPrefs = {
            ...userPrefs,
            disliked_movies: l_m,
        };
        setUserPrefs(updatedUserPrefs);
        updateToastMessage();
        console.log(userPrefs.disliked_movies);
    }

    function addLikedMovie(movie: Movie) {
        //push this liked movie to the array of liked_movies
        // in userPrefs if it not already in
        let l_m: Movie[] = userPrefs.liked_movies;
        if (l_m.indexOf(movie) == -1) {
            l_m.push(movie);
        }
        const updatedUserPrefs: UserPrefs = {
            ...userPrefs,
            liked_movies: l_m,
        };
        setUserPrefs(updatedUserPrefs);
        updateToastMessage();
        setModalFocusedMovie(movie);
        setModalVisible(true);
        console.log(userPrefs.liked_movies);
    }

    function onWindowScroll(e: any) {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        if (scrollTop + clientHeight >= (scrollHeight * 2) / 3) {
            console.log(moviesShown);
            console.log('scrolled low');
            setMoviesShown(prevMoviesShown => prevMoviesShown + 10);
        } else {
            console.log(moviesShown);
            console.log('not scrolled low');
        }
    }
    /**
     * Fetch top rated movies data from a JSON file and update the state of `movies`
     * to contain an array of movies with their movie_id, name, rating, count, and visible properties.
     */
    useEffect(() => {
        const fetchMovies = async () => {
            // Fetch data from a JSON file containing top rated movies.
            const response = await fetch('/top_rated_movies500.json');
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
        window.addEventListener('scroll', (e) => onWindowScroll(e));

        // Call the `fetchMovies` function when the component mounts.
        fetchMovies();
    }, []);


    return (
        <>
            <Navbar title={'MovieLens Recommendations'} />
            <HelpBar />
            <div className="app-container">
                {
                    movies.slice(0, moviesShown).map((movie: Movie, i: number) => (
                        <>
                            {movie.visible &&
                                <MovieContainer movie={movie}
                                    onThumbsDownClick={onThumbsDownClick}
                                    onThumbsUpClick={onThumbsUpClick}
                                    onNotSeenClick={onNotSeenClick}
                                    toggleMovieVisibility={toggleMovieVisibility} />
                            }
                            <Toast message={toastMessage} />
                        </>
                    ))
                }
                <Modal visible={modalVisible} movie={modalFocusedMovie} onClose={function (): void {
                    setModalVisible(false);
                }} />
            </div>
        </>
    )
}

export default Grid