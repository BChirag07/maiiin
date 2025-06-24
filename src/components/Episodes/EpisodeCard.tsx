import React from 'react';
import { Calendar, Users, Play } from 'lucide-react';
import { Episode } from '../../types/api';
import styles from './EpisodeCard.module.css';

interface EpisodeCardProps {
  episode: Episode;
  onClick?: (episode: Episode) => void;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(episode);
    }
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.header}>
        <div className={styles.episodeCode}>{episode.episode}</div>
        <h3 className={styles.name}>{episode.name}</h3>
        <div className={styles.airDate}>{episode.air_date}</div>
      </div>
      
      <div className={styles.details}>
        <div className={styles.detail}>
          <Calendar size={20} className={styles.detailIcon} />
          <div className={styles.detailContent}>
            <div className={styles.detailLabel}>Air Date</div>
            <div className={styles.detailValue}>{episode.air_date}</div>
          </div>
        </div>

        <div className={styles.detail}>
          <Play size={20} className={styles.detailIcon} />
          <div className={styles.detailContent}>
            <div className={styles.detailLabel}>Episode</div>
            <div className={styles.detailValue}>{episode.episode}</div>
          </div>
        </div>
      </div>

      <div className={styles.charactersCount}>
        <Users size={16} />
        {episode.characters.length} Characters
      </div>
    </div>
  );
};

export default EpisodeCard;