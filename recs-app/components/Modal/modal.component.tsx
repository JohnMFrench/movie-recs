import React from 'react';
import styles from './modal.module.css';
import Movie from '../MovieContainer/movie.type';

type ModalProps = {
    visible: boolean;
    movie: Movie | null;
    userID: string
    comparingUserID: string;
    onClose: () => void;
};

// return a number formatted to tenths place and expressed in thousands with "k"
function formatNumber(number: number): string {
  const range = { minimumFractionDigits: 1, maximumFractionDigits: 1 }
  return number.toLocaleString('en-US', range)
}


const Modal: React.FC<ModalProps> = ({ visible, movie, userID, comparingUserID, onClose }) => {
    const modalClassName = visible ? styles.modalVisible : styles.modalHidden;
    const maxRating: number = 4.5;
    const minRating: number = 3;
    const emojis = ["💔", "🤎", "💛", "❤️", "❤️‍🔥"];
    let ratingEmoji = ''
    if (movie) {
        const emoji_idx =Math.round(((movie.avgRating - minRating) / (maxRating - minRating)) * emojis.length)
        console.log('emoji_id');
        console.log(emoji_idx);
        ratingEmoji = emojis[Math.round(((movie.avgRating - minRating) / (maxRating - minRating)) * emojis.length)]
    }
    console.log("movie emoji")
    console.log(ratingEmoji);

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
                            <strong>{movie.ranking}</strong>
                            <h1 className={styles.movieTitle}>{movie.substituted_name ? movie.substituted_name : movie.name}</h1>
                            <em>An AI interpretation of {movie.name}</em>
                            <p>
                                {ratingEmoji+formatNumber(movie.avgRating)}
                                {movie.substituted_desc && movie.substituted_desc}
                            </p>
                        </div>
                    </>
                }
            </div>
        </div>
    );
};

export default Modal;
