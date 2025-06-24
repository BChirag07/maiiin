import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Character } from '../../types/api';
import styles from './CharacterCard.module.css';

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const navigate = useNavigate();

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return styles.statusAlive;
      case 'dead':
        return styles.statusDead;
      default:
        return styles.statusUnknown;
    }
  };

  const handleClick = () => {
    navigate(`/character/${character.id}`);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <img 
        src={character.image} 
        alt={character.name}
        className={styles.image}
      />
      
      <h3 className={styles.name}>{character.name}</h3>
      
      <div className={`${styles.status} ${getStatusClass(character.status)}`}>
        {character.status}
      </div>
      
      <div className={styles.info}>
        <div><strong>Species:</strong> {character.species}</div>
        <div><strong>Gender:</strong> {character.gender}</div>
        <div><strong>Location:</strong> {character.location.name}</div>
      </div>
    </div>
  );
};

export default CharacterCard;