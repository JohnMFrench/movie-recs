import React from 'react';
import styles from './modal.module.css';

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
                        <img src={movie.movie_id + ".jpg"} alt="" />
                    </>
                }
            </div>
        </div>
    );
};

export default Modal;
