import { FC } from "react";
import CookieNotification from "../CookieNotification/cookie_notification.component";
import styles from "./navbar.module.css";

interface NavbarProps {
    title: string;
}

const Navbar: FC<NavbarProps> = ({ title }) => {
    return (
        <nav className={styles.navbar}>
            <h2>
                <a className={styles.title}>{title}</a>
            </h2>
            <CookieNotification accepted={false} />
        </nav>
    );
};

export default Navbar;