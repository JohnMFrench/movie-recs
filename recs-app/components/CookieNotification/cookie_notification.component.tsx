import { useState, useEffect } from "react";
import styles from './cookie_notification.module.css';


type CookieNotificationProps = {
    accepted: boolean;
}


const CookieNotification: React.FC<CookieNotificationProps> = ({ accepted }) => {
    const [consentedToCookies, setConsentedToCookies] = useState<boolean>(accepted);

    // Load the user's cookie consent preference from localStorage on page load
    useEffect(() => {
        const localStorageConsent = localStorage.getItem("cookieConsent");
        console.log('useEffect for Cookie Notification called for page loda')
        console.log(localStorageConsent);
        if (localStorageConsent) {
            setConsentedToCookies(JSON.parse(localStorageConsent));
        }
    }, []);

    // Update localStorage with the user's cookie consent preference whenever it changes
    useEffect(() => {
        console.log('consentedToCookies useEffect called');
        localStorage.setItem("cookieConsent", JSON.stringify(consentedToCookies));
        console.log(consentedToCookies);
    }, [consentedToCookies]);

    return (
        <span className={styles.cookieNotification + ((consentedToCookies) ? "Hidden" : "")}>
                {!consentedToCookies &&
                    <p className={styles.cookieNotificationText} onClick={() => {setConsentedToCookies(true)}}>View Data Policy</p>
                }
        </span>
    );
}

export default CookieNotification
