import React from 'react';
import styles from "./button_container.module.css";
import Movie from '../MovieContainer/movie.type';
import ClickDataService from '@/api/clicks.api';
import { NextApiRequest, NextApiResponse } from 'next';

interface Props {
  movie: Movie;
  sessionId: string;
  onThumbsDownClick: (event: React.MouseEvent<HTMLDivElement>, movie_id: string) => void;
  onThumbsUpClick: (event: React.MouseEvent<HTMLDivElement>, movie_id: string) => void;
  onNotSeenClick: (event: React.MouseEvent<HTMLDivElement>, movie_id: string) => void;
}

const ButtonContainer = ({ movie, sessionId, onThumbsDownClick, onThumbsUpClick, onNotSeenClick }: Props) => {

  const cds: ClickDataService = new ClickDataService();

  return (
    <div className={styles.button_container}>
      <div className={styles.button} onClick={(event) => onThumbsDownClick(event, movie.movie_id)} title='Dislike'>
        {/* &#128078; */}
      </div>
      <div className={styles.button} onClick={(event) => {
        onNotSeenClick(event, movie.movie_id);

        // POST the click to flask api
        cds.postClick(sessionId, parseInt(movie.movie_id));
        console.log('sending CLICK to api');
      }} title='Not Seen'>
        👀
      </div>
      <div className={styles.button} onClick={(event) => onThumbsUpClick(event, movie.movie_id)} title='Like'>
        {/* &#128077; */}
      </div>
    </div>
  );
};

export default ButtonContainer;
