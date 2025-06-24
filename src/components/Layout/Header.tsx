import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <Zap size={24} />
          Rick & Morty chars explorer
        </Link>
        <nav>
          <ul className={styles.nav}>
            <li>
              <Link 
                to="/" 
                className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}//targets
              >
                Characters
              </Link>
            </li>
            <li>
              <Link 
                to="/locations" 
                className={`${styles.navLink} ${isActive('/locations') ? styles.active : ''}`}
              >
                Locations
              </Link>
            </li>
            <li>
              <Link 
                to="/episodes" 
                className={`${styles.navLink} ${isActive('/episodes') ? styles.active : ''}`}
              >
                Episodes
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;