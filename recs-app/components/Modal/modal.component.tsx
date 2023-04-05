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
                {movie &&
                    <>
                        <h2 className={styles.movieTitle}>{movie.name}</h2>
                        <img src={'http://localhost:5000/api/compare/'+userID+'/'+comparingUserID} alt="" />
                        {/* <img src={'https://johnmfrench-movie-recs-public-posters.s3.amazonaws.com/public/' + movie.movie_id + ".jpg"} alt="" /> */}
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
