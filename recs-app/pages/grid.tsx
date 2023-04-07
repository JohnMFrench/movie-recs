import React, { useState, useEffect, SyntheticEvent } from "react";
import HelpBar from "@/components/HelpBar/helpbar.component";
import Navbar from "@/components/NavBar/navbar.component";
import Toast from "@/components/Toast/toast.component";
import Modal from "@/components/Modal/modal.component";
import Movie from "@/components/MovieContainer/movie.type";
import MovieContainer from "@/components/MovieContainer/movie_container.component";
import RecContainer from "@/components/RecContainer/rec_container.component";
import RecommendationDataService from "@/api/recommendation.api";


type UserPrefs = {
    liked_movies: Movie[] | null;
    disliked_movies: Movie[] | null;
};

type movieOrNull = Movie | null;
const startingPrefs: UserPrefs = {
    liked_movies: null,
    disliked_movies: null,
};

const Grid = () => {
    const defaultMoviesShown: number = 20;
    const [movies, setMovies] = useState<Movie[]>([]);
    const [userPrefs, setUserPrefs] = useState(startingPrefs);
    const [moviesShown, setMoviesShown] = useState(defaultMoviesShown);
    const [toastMessage, setToastMessage] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalFocusedMovie, setModalFocusedMovie] = useState<movieOrNull>(null);
    const [toastRecButtonVisible, setToastRecButtonVisible] = useState(false);
    // const [reContainerVisible, setRecContainerVisible] = useState(false);
    const [nextUserID, setNextUserID] = useState('');
    const [mostSimilarUserID, setMostSimilarUseID] = useState('');
    const [isRecRequested, setIsRecRequested] = useState(false);

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
        }, 1500);
        addDislikedMovie(movie);
    }

    function onThumbsUpClick(
        event: React.MouseEvent<HTMLDivElement>,
        movie: Movie
    ): void {
        toggleMovieClosing(movie.movie_id);
        setTimeout(() => {
            toggleMovieVisibility(movie.movie_id);
        }, 1500);
        addLikedMovie(movie);
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

    function onNotSeenClick(
        event: React.MouseEvent<HTMLDivElement>,
        movie: Movie
    ): void {
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
    }

    function addLikedMovie(movie: Movie) {
        //push this liked movie to the array of liked_movies
        // in userPrefs if it not already in
        let l_m: Movie[];
        if (!userPrefs.liked_movies) {
            l_m = [movie];
        } else {
            l_m = userPrefs.liked_movies;
            if (l_m.indexOf(movie) == -1) {
                l_m.push(movie);
            }
        }
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
    }

    function onWindowScroll(e: any) {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        if (scrollTop + clientHeight >= (scrollHeight * 2) / 3) {
            setMoviesShown((prevMoviesShown) => prevMoviesShown + 10);
        }
    }

    //TODO take this out, only for testing
    useEffect(() => {
        console.log('CALLBACK FROM LIKED MOVIES');
        console.log(userPrefs.liked_movies);
    }, [userPrefs]);

    // all async behavior needs to be declared in the useEffect block
    useEffect(() => {
        // Fetch data from a JSON file containing top rated movies.
        const fetchMovies = async () => {
            const response = await fetch("/top_rated_movies500.json");
            const data = await response.json();

            // Create an array of movies from the fetched data.
            const movieArray: unknown[] = Object.values(data);
            const updatedMovieArray = movieArray.map((movie: any, index) => ({
                movie_id: Object.keys(data)[index],
                name: movie.title,
                avgRating: movie.AvgRating,
                count: movie.Count,
                visible: true,
                closing: false,
            }));

            // sort the array in descending order of Count
            updatedMovieArray.sort((a:Movie, b:Movie) => b.count - a.count);

            // Get the maximum movie rating
            const maxRating:number = Math.max(...updatedMovieArray.map(movie => movie.avgRating));
            const minRating:number = Math.min(...updatedMovieArray.map(movie => movie.avgRating));
            console.log('max');
            console.log(maxRating);
            console.log('min');
            console.log(minRating);

            // Update the state of `movies` with the array of movies.
            setMovies(updatedMovieArray);
        };
        window.addEventListener("scroll", (e) => onWindowScroll(e));

        // Call the `fetchMovies` function when the component mounts.
        fetchMovies();

        const ds = new RecommendationDataService();
        // Call the `fextNextUserID` function when the component mounts.
        if (userPrefs.liked_movies && !mostSimilarUserID && !isRecRequested) {
            setIsRecRequested(true);
            ds.getMostSimilarUser(nextUserID, userPrefs.liked_movies)
                .then((data: any) => {
                    console.log('FOUND SIMILAR USER');
                    console.log(data.user);
                    setMostSimilarUseID(data.user);
                })
                .catch((e: any) => {
                    console.log('caught error:' + e);
                })
        }
    }, [toastRecButtonVisible]);

    return (
        <>
            <Navbar title={"MovieLens Recommendations"} />
            <HelpBar />
            <div className={"app-container"}>
                {movies.slice(0, moviesShown).map((movie: Movie, i: number) => (
                    <>
                        {movie.visible && (
                            <MovieContainer
                                key={i}
                                movie={movie}
                                onThumbsDownClick={(e) => onThumbsDownClick(e, movie)}
                                onThumbsUpClick={(e) => onThumbsUpClick(e, movie)}
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
                    userID={nextUserID}
                    comparingUserID={mostSimilarUserID} />
                <RecContainer type={"similar_user"} user1_id={nextUserID} user2_id={mostSimilarUserID} visible={toastRecButtonVisible} />
            </div>
        </>
    );
};

export default Grid;
