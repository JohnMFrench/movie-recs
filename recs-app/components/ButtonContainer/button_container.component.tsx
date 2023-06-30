import React from 'react';
import styles from "./button_container.module.css";
import Movie from '../MovieContainer/movie.type';
import clickApiHandler from "@/pages/api/click";
import { NextApiRequest, NextApiResponse } from 'next';

interface Props {
  movie: Movie;
  sessionId: string;
  onThumbsDownClick: (event: React.MouseEvent<HTMLDivElement>, movie_id: string) => void;
  onThumbsUpClick: (event: React.MouseEvent<HTMLDivElement>, movie_id: string) => void;
  onNotSeenClick: (event: React.MouseEvent<HTMLDivElement>, movie_id: string) => void;
}

const makeClickApiCall = async (sessionId: string, movieId: string) => {
  try {
    const response = await fetch('/api/click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId, movieId }),
    });

    if (!response.ok) {
      throw new Error('Failed to make the API call');
    }

    // Handle the successful response
    const data = await response.json();
    console.log(data); // Do something with the response data
  } catch (error) {
    // Handle errors
    console.error(error);
  }
};

const ButtonContainer = ({ movie, sessionId, onThumbsDownClick, onThumbsUpClick, onNotSeenClick }: Props) => {

  return (
    <div className={styles.button_container}>
      <div className={styles.button} onClick={(event) => onThumbsDownClick(event, movie.movie_id)} title='Dislike'>
        {/* &#128078; */}
      </div>
      <div className={styles.button} onClick={(event) => {
        onNotSeenClick(event, movie.movie_id);

        // POST the click to flask api
        makeClickApiCall(sessionId, movie.movie_id);
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
