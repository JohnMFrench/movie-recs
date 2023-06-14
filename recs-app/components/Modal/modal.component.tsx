import { useEffect, useState } from 'react';
import styles from './modal.module.css';
import Movie from '../MovieContainer/movie.type';
import Image from 'next/image';

type ModalProps = {
    visible: boolean;
    movie: Movie | null;
    userID: string
    comparingUserID: string;
    movie_list: Movie[];
    onClose: () => void;
};

// return a number formatted to tenths place and expressed in thousands with "k"
function formatNumber(number: number): string {
    const range = { minimumFractionDigits: 1, maximumFractionDigits: 1 }
    return number.toLocaleString('en-US', range)
}


const Modal: React.FC<ModalProps> = ({ visible, movie, userID, comparingUserID, onClose, movie_list }) => {
    const modalClassName = visible ? styles.modalVisible : styles.modalHidden;
    const [similar_movies, setSimilarMovies] = useState<Movie[]>([]);
    console.log(movie?.similar_movie_ids);

    let s3BucketBaseURL = "https://popcorn-posters.s3.us-east-2.amazonaws.com/";

    // a specific emoji will be displayed based on the average rating
    const maxRating: number = 4.5;
    const minRating: number = 3;
    const emojis = ["💔", "🤎", "💛", "❤️", "❤️‍🔥"];
    let ratingEmoji = ''
    if (movie) {
        const emoji_idx = Math.floor(((movie.avgRating - minRating) / (maxRating - minRating)) * emojis.length)
        ratingEmoji = emojis[emoji_idx]
        console.log("movie emoji");
        console.log(emoji_idx);
    }

    function filterSimilarMovies(similar: number[]): Movie[] {
        const movieMap = new Map(movie_list.map((movie) => [parseInt(movie.movie_id), movie]));
        let similars = similar.map((id) => movieMap.get(id)).filter((movie) => movie !== undefined);
        return similars as Movie[]; // Cast the resulting array to Movie[]
    }

    useEffect(() => {
        if (movie && movie.similar_movie_ids) {
            setSimilarMovies(filterSimilarMovies(movie.similar_movie_ids));
            // setSimilarMovies(movie.similar_movie_ids);
        }
    }, [movie?.similar_movie_ids])

    return (
        <div className={modalClassName} onClick={onClose}>
            <div className={styles.modalContent} onClick={(event) => event.stopPropagation()}>
                {comparingUserID &&
                    <ul>
                        <li>userID={userID}</li>
                        <li>comparingUserID={comparingUserID}</li>
                    </ul>
                }
                {comparingUserID && userID &&
                    <img src={'http://localhost:5000/api/compare/' + userID + '/' + comparingUserID} alt="" />
                }
                {movie &&
                    <>
                        <img src={'https://johnmfrench-movie-recs-public-posters.s3.amazonaws.com/public/' + movie.movie_id + ".jpg"} alt="" />
                        <div className={styles.modalContentContainer}>
                            {/* <h1 className={styles.movieTitle}>{movie.substituted_name ? movie.substituted_name : movie.name}</h1> */}
                            <h1 className={styles.movieTitle}>{movie.name}</h1>
                            {/* <em>An AI interpretation of {movie.name}</em> */}
                            <p>{ratingEmoji + formatNumber(movie.avgRating)}</p>
                            {/* <p>{movie.substituted_desc && movie.substituted_desc}</p> */}

                            <strong>Users also enjoyed</strong>
                            {similar_movies.map((similar_movie, i) => {
                                return (
                                    <div className={styles.similarMovieContainer} key={similar_movie.movie_id}>
                                        <div className="left">
                                            <div>{similar_movie.name}</div>
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                {movie.similar_movie_tags[i].map((shared_tag: any, i: number) => {
                                                    return <span className={styles.sharedTag} key={i}>{shared_tag}</span>
                                                })}
                                            </div>
                                        </div>
                                        <div className="right">
                                            <Image
                                                src={s3BucketBaseURL + similar_movie.movie_id + ".jpg"}
                                                className={styles.movieImage}
                                                width={255}
                                                height={255}
                                                alt={"Movie poster for " + movie.name}
                                                onError={(e) => console.log(e)}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className={styles.closeButton} onClick={onClose}><p>❌</p></div>
                    </>
                }
            </div>
        </div>
    );
};

export default Modal;
