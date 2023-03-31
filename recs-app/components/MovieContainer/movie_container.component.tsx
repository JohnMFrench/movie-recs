import React, { useState } from 'react';
import styles from './movie_container.module.css';
import Movie from './movie.type';
import ButtonContainer from '../ButtonContainer/button_container.component';

interface MovieContainerProps {
    movie: Movie;
    // onThumbsUpClick
    onThumbsDownClick(event: React.MouseEvent<HTMLDivElement>, movie_id: string): void;
    onThumbsUpClick(event: React.MouseEvent<HTMLDivElement>, movie_id: string): void;
    onNotSeenClick(event: React.MouseEvent<HTMLDivElement>, movie_id: string): void;
    toggleMovieVisibility(movie_id: string): void;
}

function MovieContainer(props: MovieContainerProps) {
    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
        const imgElement = event.currentTarget;
        imgElement.style.display = 'none';
    }

    return (
        <div
            key={props.movie.movie_id}
            className={styles.movieContainer + ` ${props.movie.closing ? "closed" : ""}`} onAnimationEnd={() => props.toggleMovieVisibility(props.movie.movie_id)}>
            <div className={styles.imageContainer}>
                <img
                    src={'https://johnmfrench-movie-recs-public-posters.s3.amazonaws.com/public/' + props.movie.movie_id + '.jpg'}
                    alt=""
                    onError={handleImageError}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    className={styles.movieImage}
                />
                <div className={styles.overlay}>
                    {props.movie.name}
                    <ButtonContainer
                        movie={props.movie}
                        onNotSeenClick={(e: React.MouseEvent<HTMLDivElement>) => props.onNotSeenClick(e, props.movie.movie_id)}
                        onThumbsDownClick={(e: React.MouseEvent<HTMLDivElement>) => props.onThumbsDownClick(e, props.movie.movie_id)}
                        onThumbsUpClick={(e: React.MouseEvent<HTMLDivElement>) => props.onThumbsUpClick(e, props.movie.movie_id)}
                    />
                </div>
            </div>
        </div>

    );
}

export default MovieContainer;