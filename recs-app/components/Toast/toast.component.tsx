import React, { useState, useEffect } from 'react';
import styles from './toast.module.css';
import ToastProps from './toast.type';

const Toast: React.FC<ToastProps> = ({ message, recButtonVisible, onRequestRecommendation }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutLength: number = 2000;

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      if (!recButtonVisible) {
        setTimeout(() => {
          setIsVisible(false);
        }, timeoutLength);
      }
    }
  }, [message]);

  return (
    <div className={`${styles.toast} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.message}>
        🍿{message}
      </div>
      {recButtonVisible &&
        <div className={styles.recButton} onClick={
          (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => onRequestRecommendation(e)
        }>👥User-Based Recommendation</div>
      }
    </div>
  );
};

export default Toast;
