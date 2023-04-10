import { FC } from "react";
import CookieNotification from "../CookieNotification/cookie_notification.component";
import styles from "./navbar.module.css";
import Movie from "../MovieContainer/movie.type";

interface NavbarProps {
    title: string;
    liked_movies: Movie[] | null;
}

const Navbar: FC<NavbarProps> = ({ title, liked_movies }) => {
    const num_reviews_required: number = 3;
    return (
        <nav className={styles.navbar}>
            <h2>
                <a className={styles.title}>{'MovieLens Recommends'}</a>
            </h2>
            {liked_movies &&
                <span className={styles.navbarButton}>
                    <span className={styles.left}>{liked_movies.length}</span>
                    <span className={styles.right}>🍿</span>
                </span >
            }
            {/* this part should only be displayed if the user has 
            chose three 👍 movies */}
            {liked_movies && liked_movies.length >= num_reviews_required ? (
                <span className={styles.navbarButton + ' ' + styles.navbarButtonRecommend}>🧠Recommend</span>
            ) : null}
            <CookieNotification accepted={false} />
        </nav>
    );
};

export default Navbar;