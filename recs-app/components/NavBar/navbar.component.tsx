import { FC } from "react";
import styles from "./navbar.module.css";

interface NavbarProps {
    title: string;
}

const Navbar: FC<NavbarProps> = ({ title }) => {
    return (
        <nav className={styles.navbar}>
            <h1>
                <a className={styles.title}>{title}</a>
            </h1>
        </nav>
    );
};

export default Navbar;