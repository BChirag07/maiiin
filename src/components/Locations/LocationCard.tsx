import React from 'react';
import { Globe, Users, MapPin } from 'lucide-react';
import { Location } from '../../types/api';
import styles from './LocationCard.module.css';

interface LocationCardProps {
  location: Location;
  onClick?: (location: Location) => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(location);
    }
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.header}>
        <h3 className={styles.name}>{location.name}</h3>
        <div className={styles.type}>{location.type}</div>
      </div>
      
      <div className={styles.details}>
        <div className={styles.detail}>
          <Globe size={20} className={styles.detailIcon} />
          <div className={styles.detailContent}>
            <div className={styles.detailLabel}>Dimension</div>
            <div className={styles.detailValue}>{location.dimension}</div>
          </div>
        </div>

        <div className={styles.detail}>
          <MapPin size={20} className={styles.detailIcon} />
          <div className={styles.detailContent}>
            <div className={styles.detailLabel}>Location ID</div>
            <div className={styles.detailValue}>#{location.id}</div>
          </div>
        </div>
      </div>

      <div className={styles.residentsCount}>
        <Users size={16} />
        {location.residents.length} Residents
      </div>
    </div>
  );
};

export default LocationCard;