import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'normal' | 'large';
  centered?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'normal', 
  centered = false 
}) => {
  const spinnerClass = `${styles.spinner} ${size === 'large' ? styles.large : ''}`;
  
  if (centered) {
    return (
      <div className={styles.container}>
        <div className={spinnerClass}></div>
      </div>
    );
  }

  return <div className={spinnerClass}></div>;
};

export default LoadingSpinner;