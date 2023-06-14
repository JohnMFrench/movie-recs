import React, { useEffect, useState } from "react";
import styles from "./movie_container.module.css";
import Movie from "./movie.type";
import ButtonContainer from "../ButtonContainer/button_container.component";
import Image from "next/image";

interface MovieContainerProps {
  movie: Movie;
  onThumbsDownClick(
    event: React.MouseEvent<HTMLDivElement>,
    movie_id: string
  ): void;
  onThumbsUpClick(
    event: React.MouseEvent<HTMLDivElement>,
    movie_id: string
  ): void;
  onNotSeenClick(
    event: React.MouseEvent<HTMLDivElement>,
    movie_id: string
  ): void;
  toggleMovieVisibility(movie_id: string): void;
}

// return a number formatted to tenths place and expressed in thousands with "k"
function formatNumber(number: number): string {
  const range = { minimumFractionDigits: 1, maximumFractionDigits: 1 }
  const result = (number < 10000) ? number.toLocaleString('en-US', { maximumFractionDigits: 0 })
    : (number / 1000).toLocaleString('en-US', range) + "k";
  return result;
}

function MovieContainer(props: MovieContainerProps) {
  let s3BucketBaseURL = "https://popcorn-posters.s3.us-east-2.amazonaws.com/";
  const [genres, setGenres] = useState<string>();

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const imgElement = event.currentTarget;
    imgElement.style.display = "none";
  };

  return (
    <div
      key={props.movie.movie_id}
      className={
        styles.movieContainer + ` ${props.movie.closing ? styles.closed : ""}`
      }
      onAnimationEnd={() => props.toggleMovieVisibility(props.movie.movie_id)}
    >
      <div className={styles.imageContainer}>
        <img
          src={
            s3BucketBaseURL +
            props.movie.movie_id +
            ".jpg"
          }
          className={styles.movieImage}
          alt={"Movie poster for " + props.movie.name}
        />

        {/* took this out to load images without cdn */}
        {/* <Image
          src={
            s3BucketBaseURL +
            props.movie.movie_id +
            ".jpg"
          }
          className={styles.movieImage}
          fill={true}
          alt={"Movie poster for " + props.movie.name}
          onError={(e) => (console.log(e))}
        /> */}
        <div className={styles.overlay}>
          {/* <h2 className={styles.movieContainerTitle}>{props.movie.substituted_name ? props.movie.substituted_name : props.movie.name}</h2> */}
          <h2 className={styles.movieContainerTitle}>{props.movie.name}</h2>
          <h2 className={styles.movieContainerGenres}>
            <em>
              {genres && genres.replace(/\|/g, ' | ')}
            </em>
          </h2>
          <p className={styles.movieCount}>{'📝' + formatNumber(props.movie.count)}</p>
          {/* <p>{'📝'+props.movie.avgRating}</p> */}
          <ButtonContainer
            movie={props.movie}
            onNotSeenClick={(e: React.MouseEvent<HTMLDivElement>) => {
              props.onNotSeenClick(e, props.movie.movie_id)
            }
            }
            onThumbsDownClick={(e: React.MouseEvent<HTMLDivElement>) =>
              props.onThumbsDownClick(e, props.movie.movie_id)
            }
            onThumbsUpClick={(e: React.MouseEvent<HTMLDivElement>) =>
              props.onThumbsUpClick(e, props.movie.movie_id)
            }
          />
        </div>
      </div>
    </div>
  );
}

export default MovieContainer;
