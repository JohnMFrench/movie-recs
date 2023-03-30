import React, { useState, useEffect } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }
  }, [message]);

  return (
    <div className={`${styles.toast} ${isVisible ? styles.visible : ''}`}>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
