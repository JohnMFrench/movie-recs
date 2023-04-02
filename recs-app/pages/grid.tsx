import React, { useState, useEffect, SyntheticEvent } from "react";
import HelpBar from "@/components/HelpBar/helpbar.component";
import Navbar from "@/components/NavBar/navbar.component";
import ButtonContainer from "@/components/ButtonContainer/button_container.component";
import Toast from "@/components/Toast/toast.component";
import Modal from "@/components/Modal/modal.component";
import Movie from "@/components/MovieContainer/movie.type";
import MovieContainer from "@/components/MovieContainer/movie_container.component";
import ToastProps from "@/components/Toast/toast.type";
import RecContainer from "@/components/RecContainer/rec_container.component";


type UserPrefs = {
    liked_movies: Movie[];
    disliked_movies: Movie[];
};

interface Props {
    userPrefs: UserPrefs;
    setUserPrefs: React.Dispatch<React.SetStateAction<UserPrefs>>;
}

type movieOrNull = Movie | null;

const Grid = () => {
    const defaultMoviesShown: number = 20;
    const [movies, setMovies] = useState<Movie[]>([]);
    const startingPrefs: UserPrefs = {
        liked_movies: [],
        disliked_movies: [],
    };
    const [userPrefs, setUserPrefs] = useState(startingPrefs);
    const [moviesShown, setMoviesShown] = useState(defaultMoviesShown);
    const [toastMessage, setToastMessage] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalFocusedMovie, setModalFocusedMovie] = useState<movieOrNull>(null);
    const [toastRecButtonVisible, setToastRecButtonVisible] = useState(false);
    const [reContainerVisible, setRecContainerVisible] = useState(false);
    const [nextUserID, setNextUserID] = useState('');

    const toggleMovieClosing = (movie_id: string) =>
        setMovies(
            movies.map((movie) =>
                movie.movie_id == movie_id ? { ...movie, closing: true } : movie
            )
        );
    const toggleMovieVisibility = (movie_id: string) => {
        setMovies(movies.filter((movie) => movie.movie_id !== movie_id));
    };

    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
        const imgElement = event.currentTarget;
        imgElement.style.display = "none";
    };

    function onThumbsDownClick(
        event: React.MouseEvent<HTMLDivElement>,
        movie: Movie
    ): void {
        toggleMovieClosing(movie.movie_id);
        setTimeout(() => {
            toggleMovieVisibility(movie.movie_id);
        }, 500);
        const movieToUpdate = movies.find(
            (movie: Movie) => movie.movie_id == movie.movie_id
        );
        if (movieToUpdate) {
            addDislikedMovie(movieToUpdate);
        }
    }

    function updateToastMessage() {
        const numMoviesLiked: number =
            userPrefs.liked_movies.length + userPrefs.disliked_movies.length;
        setToastMessage(numMoviesLiked.toString());
        // prevents toast from becoming visible again
        setTimeout(() => setToastMessage(""), 1000);
    }

    function onThumbsUpClick(
        event: React.MouseEvent<HTMLDivElement>,
        movie_id: string
    ): void {
        // console.log('clicked up movie ' + movie_id)
        toggleMovieClosing(movie_id);
        const movieToUpdate = movies.find(
            (movie: Movie) => movie.movie_id == movie_id
        );
        if (movieToUpdate) {
            addLikedMovie(movieToUpdate);
        }
        console.log("movies = " + movies.length);
    }

    function onNotSeenClick(
        event: React.MouseEvent<HTMLDivElement>,
        movie: Movie
    ): void {
        // console.log('clicked not seen ' + movie_id)
        // toggleMovieClosing(movie_id);
        setModalVisible(true);
        setModalFocusedMovie(movie);
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
        // setModalVisible(true);
        if (l_m.length >= 5) {
            setToastRecButtonVisible(true);
        }
        console.log(userPrefs.liked_movies);
    }

    function onWindowScroll(e: any) {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        if (scrollTop + clientHeight >= (scrollHeight * 2) / 3) {
            setMoviesShown((prevMoviesShown) => prevMoviesShown + 10);
        }
    }
    /**
     * Fetch top rated movies data from a JSON file and update the state of `movies`
     * to contain an array of movies with their movie_id, name, rating, count, and visible properties.
     */
    useEffect(() => {
        const fetchNextUserID = async () => {
            //fetch user_id from api endpoint
            const response = await fetch("127.0.0.1:5000/api/user");
            if (!response) {
                throw new Error("network error when trying to get user id");
            }
            const next_id = await response.text();
            setNextUserID(next_id);
        }

        const fetchMovies = async () => {
            // Fetch data from a JSON file containing top rated movies.
            const response = await fetch("/top_rated_movies500.json");
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
        window.addEventListener("scroll", (e) => onWindowScroll(e));

        // Call the `fetchMovies` function when the component mounts.
        fetchMovies();
        // Call the `fextNextUserID` function when the component mounts.
        fetchNextUserID();
    }, []);

    return (
        <>
            <Navbar title={"MovieLens Recommendations" + { nextUserID }} />
            <HelpBar />
            <div className={"app-container"}>
                {movies.slice(0, moviesShown).map((movie: Movie, i: number) => (
                    <>
                        {movie.visible && (
                            <MovieContainer
                                movie={movie}
                                onThumbsDownClick={(e) => onThumbsDownClick(e, movie)}
                                onThumbsUpClick={onThumbsUpClick}
                                onNotSeenClick={(e: React.MouseEvent<HTMLDivElement>) =>
                                    onNotSeenClick(e, movie)
                                }
                                toggleMovieVisibility={toggleMovieVisibility}
                            />
                        )}
                        <Toast
                            message={toastMessage}
                            recButtonVisible={toastRecButtonVisible}
                        />
                    </>
                ))}
                <Modal
                    visible={modalVisible}
                    movie={modalFocusedMovie}
                    onClose={function (): void {
                        setModalVisible(false);
                    }}
                />
                <RecContainer type={"similar_user"} user1_id={"5"} user2_id={"9"} visible={reContainerVisible} />
            </div>
        </>
    );
};

export default Grid;
