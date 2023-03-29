import React from 'react';
import styles from "./button_container.module.css";

interface Props {
  movie: {
    movie_id: string;
    name: string;
    rating: number;
    count: number;
    visible: boolean;
    closing: boolean;
  };
  onThumbsDownClick: (event: React.MouseEvent<HTMLDivElement>, movie_id: string) => void;
  onThumbsUpClick: (event: React.MouseEvent<HTMLDivElement>, movie_id: string) => void;
  onNotSeenClick: (event: React.MouseEvent<HTMLDivElement>, movie_id: string) => void;
}

const ButtonContainer = ({ movie, onThumbsDownClick, onThumbsUpClick, onNotSeenClick }: Props) => {
  return (
    <div className={styles.button_container}>
      <div className={styles.button} onClick={(event) => onNotSeenClick(event, movie.movie_id)}>
        &#128078;
      </div>
      <div className={styles.button} onClick={(event) => onThumbsDownClick(event, movie.movie_id)}>
        👀
      </div>
      <div className={styles.button} onClick={(event) => onThumbsUpClick(event, movie.movie_id)}>
        &#128077;
      </div>
    </div>
  );
};

export default ButtonContainer;
