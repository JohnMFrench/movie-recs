import React, { useEffect, useState } from "react";
import styles from "./movie_container.module.css";
import Movie from "./movie.type";
import ButtonContainer from "../ButtonContainer/button_container.component";
import GenreDataService from "@/api/movies.api";

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

function MovieContainer(props: MovieContainerProps) {
  const [genres, setGenres] = useState<string[]>([]);

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const imgElement = event.currentTarget;
    imgElement.style.display = "none";
  };

  useEffect(() => {
    const genreDataService = new GenreDataService();
    genreDataService
      .getGenres(Number.parseInt(props.movie.movie_id))
      .then((response) => {
        setGenres(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
            "https://johnmfrench-movie-recs-public-posters.s3.amazonaws.com/public/" +
            props.movie.movie_id +
            ".jpg"
          }
          alt=""
          onError={handleImageError}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          className={styles.movieImage}
        />
        <div className={styles.overlay}>
          <h2 className={styles.movieContainerTitle}>{props.movie.name}</h2>
          <h2 className={styles.movieContainerGenres}>
            {/* <em> */}
            {genres}
            {/* </em> */}
          </h2>
          <ButtonContainer
            movie={props.movie}
            onNotSeenClick={(e: React.MouseEvent<HTMLDivElement>) =>
              props.onNotSeenClick(e, props.movie.movie_id)
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
