import React, { useState, useEffect } from 'react';
import styles from './toast.module.css';
import ToastProps from './toast.type';

const Toast: React.FC<ToastProps> = ({ message, recButtonVisible }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      // if (!recButtonVisible) {
      // }
      setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    }
  }, [message]);

  return (
    <div className={`${styles.toast} ${isVisible ? styles.visible : ''}`}>
      {/* <span> */}
      <div className={styles.message}>
        🍿{message}
      </div>
      {recButtonVisible &&
        <div className={styles.recButton}>👥User-Based Recommendation</div>
      }
      {/* </span> */}
    </div>
  );
};

export default Toast;
