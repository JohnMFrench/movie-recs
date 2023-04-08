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

const Modal: React.FC<ModalProps> = ({ visible, movie, userID, comparingUserID, onClose }) => {
    const modalClassName = visible ? styles.modalVisible : styles.modalHidden;

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
                            <h1 className={styles.movieTitle}>{movie.substituted_name ? movie.substituted_name : movie.name}</h1>
                            <em>An AI interpretation of {movie.name}</em>
                            <p>{movie.substituted_desc}</p>
                        </div>
                        {/* <ButtonContainer movie={movie}
                            onThumbsDownClick={function (event: React.MouseEvent<HTMLDivElement, MouseEvent>, movie_id: string): void {
                                throw new Error('Function not implemented.');
                            }} onThumbsUpClick={function (event: React.MouseEvent<HTMLDivElement, MouseEvent>, movie_id: string): void {
                                throw new Error('Function not implemented.');
                            }} onNotSeenClick={function (event: React.MouseEvent<HTMLDivElement, MouseEvent>, movie_id: string): void {
                                throw new Error('Function not implemented.');
                            }} /> */}
                    </>
                }
            </div>
        </div>
    );
};

export default Modal;
