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
import RecommendationDataService from "@/api/recommendation.api";


type UserPrefs = {
    liked_movies: Movie[] | null;
    disliked_movies: Movie[] | null;
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
        liked_movies: null,
        disliked_movies: null,
    };
    const [userPrefs, setUserPrefs] = useState(startingPrefs);
    const [moviesShown, setMoviesShown] = useState(defaultMoviesShown);
    const [toastMessage, setToastMessage] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalFocusedMovie, setModalFocusedMovie] = useState<movieOrNull>(null);
    const [toastRecButtonVisible, setToastRecButtonVisible] = useState(false);
    // const [reContainerVisible, setRecContainerVisible] = useState(false);
    const [nextUserID, setNextUserID] = useState('');
    const [mostSimilarUserID, SetMostSimilarUseID] = useState('');

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
        if (userPrefs.liked_movies && userPrefs.disliked_movies) {
            const numMoviesLiked: number =
                userPrefs.liked_movies.length + userPrefs.disliked_movies.length;
            setToastMessage(numMoviesLiked.toString());
            // prevents toast from becoming visible again
            setTimeout(() => setToastMessage(""), 1000);
        }
    }

    function onRequestReviewClick(
        event: React.MouseEvent<HTMLDivElement>,
        userPrefs: UserPrefs,
    ): void {
        console.log('clicked request review');
        setModalVisible(true);
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
        let l_m: Movie[];
        if (!userPrefs.disliked_movies) {
            l_m = [movie];
        } else {
            l_m = userPrefs.disliked_movies;
            if (l_m.indexOf(movie) == -1) {
                l_m.push(movie);
            }
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
        let l_m: Movie[];
        if (!userPrefs.liked_movies) {
            console.log('no movies in l_m yet');
            l_m = [movie];
        } else {
            l_m = userPrefs.liked_movies;
            if (l_m.indexOf(movie) == -1) {
                console.log('pushing movie to l_m');
                l_m.push(movie);
            }
        }
        // console.log('l_m now');
        // console.log(l_m);
        const updatedUserPrefs: UserPrefs = {
            ...userPrefs,
            liked_movies: l_m,
        };
        setUserPrefs(updatedUserPrefs);
        updateToastMessage();
        // setModalVisible(true);
        if (l_m.length >= 3) {
            setToastRecButtonVisible(true);
        }
        // console.log(userPrefs.liked_movies);
    }

    function onWindowScroll(e: any) {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        if (scrollTop + clientHeight >= (scrollHeight * 2) / 3) {
            setMoviesShown((prevMoviesShown) => prevMoviesShown + 10);
        }
    }
    // all async behavior needs to be declared in the useEffect block
    useEffect(() => {
        //request recommendation after button is pressed
        const fetchUserRecommendation = async (prefs: UserPrefs) => {
            const apiUrl = 'http://127.0.0.1:5000/api/ratings';
            const movie_ids = [];
            const ratings = [];
            for (let movie in prefs.liked_movies) {
                movie_ids.push(movie)
                ratings.push(5);
            }
            const newRating = {
                movie_id: movie_ids,
                user_id: nextUserID,
                rating: ratings,
            };
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRating)
            };
            try {
                const response = await fetch(apiUrl, requestOptions);
                if (!response.ok) {
                    console.error('Failed to post rating:', response.status, response.statusText);
                } else {
                    console.log('submitted rating for movies');
                }
            } catch (error) {
                console.error('Failed to post rating:', error);
            }
        }

        //fetch user_id from api endpoint
        const fetchNextUserID = async () => {
            const response = await fetch("http://127.0.0.1:5000/api/user");
            if (!response) {
                throw new Error("network error when trying to get user id");
            }
            const next_id = await response.text()
            console.log(next_id);
            if (typeof next_id == typeof "s") {
                setNextUserID(next_id);
            }
        }

        // Fetch data from a JSON file containing top rated movies.
        const fetchMovies = async () => {
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

        const ds = new RecommendationDataService();
        // Call the `fextNextUserID` function when the component mounts.
        if (!nextUserID) {
            fetchNextUserID();
        } else {
            if (userPrefs.liked_movies && !mostSimilarUserID && !toastRecButtonVisible) {
                ds.getMostSimilarUser(nextUserID, userPrefs.liked_movies)
                    .then((data: any) => {
                        SetMostSimilarUseID(data);
                    })
                    .catch((e: any) => {
                        console.log('caught error:' + e);
                    })
            }
        }
    }, [toastRecButtonVisible]);

    return (
        <>
            <Navbar title={"MovieLens Recommendations"+mostSimilarUserID} />
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
                            onRequestRecommendation={(e) => onRequestReviewClick(e, userPrefs)}
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
                <RecContainer type={"similar_user"} user1_id={nextUserID} user2_id={mostSimilarUserID} visible={toastRecButtonVisible} />
            </div>
        </>
    );
};

export default Grid;
