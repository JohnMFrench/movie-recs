import React from 'react';
import styles from './modal.module.css';
import ButtonContainer from '../ButtonContainer/button_container.component';

interface Movie {
    movie_id: string;
    name: string;
    rating: number;
    count: number;
    visible: boolean;
    closing: boolean;
}

type ModalProps = {
    visible: boolean;
    movie: Movie | null;
    onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ visible, movie, onClose }) => {
    const modalClassName = visible ? styles.modalVisible : styles.modalHidden;

    return (
        <div className={modalClassName} onClick={onClose}>
            <div className={styles.modalContent} onClick={(event) => event.stopPropagation()}>
                {movie &&
                    <>
                        <h2>{movie.name}</h2>
                        <img src={'https://johnmfrench-movie-recs-public-posters.s3.amazonaws.com/public/' + movie.movie_id + ".jpg"} alt="" />
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
