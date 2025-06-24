import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Dna, 
  MapPin, 
  Globe, 
  Users, 
  Calendar,
  Play
} from 'lucide-react';
import { Character, Location, Episode } from '../../types/api';
import { api } from '../../services/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import styles from './CharacterDetail.module.css';

const CharacterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  
  const [character, setCharacter] = useState<Character | null>(null);
  const [originLocation, setOriginLocation] = useState<Location | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacterData = async () => {
      try {
        setIsLoading(true);
        setError(null);

       
        if (!id) {
          throw new Error('No character ID provided');
        }

        
        const characterData = await api.getCharacter(parseInt(id));
        setCharacter(characterData);

        
        const dataPromises: Promise<any>[] = [];

        
        if (characterData.origin.url) {
          dataPromises.push(api.getLocationByUrl(characterData.origin.url));
        }

        
        if (characterData.location.url) {
          dataPromises.push(api.getLocationByUrl(characterData.location.url));
        }

       
        if (characterData.episode.length > 0) {
          dataPromises.push(api.getMultipleEpisodes(characterData.episode));
        }

       
        const results = await Promise.allSettled(dataPromises);
        
        
        let resultIndex = 0;
        
        
        if (characterData.origin.url) {
          const originResult = results[resultIndex++];
          if (originResult.status === 'fulfilled') {
            setOriginLocation(originResult.value);
          }
        }

        
        if (characterData.location.url) {
          const locationResult = results[resultIndex++];
          if (locationResult.status === 'fulfilled') {
            setCurrentLocation(locationResult.value);
          }
        }

        
        if (characterData.episode.length > 0) {
          const episodeResult = results[resultIndex++];
          if (episodeResult.status === 'fulfilled') {
            setEpisodes(episodeResult.value);
          }
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load character';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacterData();
  }, [id]);

  
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return styles.statusAlive;
      case 'dead':
        return styles.statusDead;
      default:
        return styles.statusUnknown;
    }
  };

  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // loading spinner ann
  if (isLoading) {
    return <LoadingSpinner size="large" centered />;
  }

 //Err fetch problem
  if (error || !character) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Character Not Found</h2>
          <p>{error || 'The character you are looking for does not exist.'}</p>
          <Link to="/" className={styles.backButton}>
            <ArrowLeft size={20} />
            Back to Characters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Back button */}
      <Link to="/" className={styles.backButton}>
        <ArrowLeft size={20} />
        Back to Characters
      </Link>

      {/* Character hero section */}
      <div className={styles.hero}>
        <div className={styles.imageContainer}>
          <img 
            src={character.image} 
            alt={character.name}
            className={styles.image}
          />
          <div className={`${styles.statusBadge} ${getStatusBadgeClass(character.status)}`}>
            {character.status}
          </div>
        </div>

        <div className={styles.info}>
          <h1 className={styles.name}>{character.name}</h1>
          
          {/* Character ke grid banana with deets */}
          <div className={styles.details}>
            <div className={styles.detail}>
              <Dna size={24} className={styles.detailIcon} />
              <div className={styles.detailContent}>
                <div className={styles.detailLabel}>Species</div>
                <div className={styles.detailValue}>{character.species}</div>
              </div>
            </div>

            {character.type && (
              <div className={styles.detail}>
                <User size={24} className={styles.detailIcon} />
                <div className={styles.detailContent}>
                  <div className={styles.detailLabel}>Type</div>
                  <div className={styles.detailValue}>{character.type}</div>
                </div>
              </div>
            )}

            <div className={styles.detail}>
              <User size={24} className={styles.detailIcon} />
              <div className={styles.detailContent}>
                <div className={styles.detailLabel}>Gender</div>
                <div className={styles.detailValue}>{character.gender}</div>
              </div>
            </div>

            <div className={styles.detail}>
              <Calendar size={24} className={styles.detailIcon} />
              <div className={styles.detailContent}>
                <div className={styles.detailLabel}>Created</div>
                <div className={styles.detailValue}>
                  {formatDate(character.created)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className={styles.sections}>
        
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <MapPin size={24} />
            Locations
          </h2>
          
          
          {originLocation && (
            <div className={styles.locationCard}>
              <div className={styles.locationName}>Origin: {originLocation.name}</div>
              <div className={styles.locationDetails}>
                <div className={styles.locationDetail}>
                  <Globe size={16} />
                  Type: {originLocation.type}
                </div>
                <div className={styles.locationDetail}>
                  <Globe size={16} />
                  Dimension: {originLocation.dimension}
                </div>
                <div className={styles.locationDetail}>
                  <Users size={16} />
                  Residents: {originLocation.residents.length}
                </div>
              </div>
            </div>
          )}

          
          {currentLocation && (
            <div className={styles.locationCard}>
              <div className={styles.locationName}>Current: {currentLocation.name}</div>
              <div className={styles.locationDetails}>
                <div className={styles.locationDetail}>
                  <Globe size={16} />
                  Type: {currentLocation.type}
                </div>
                <div className={styles.locationDetail}>
                  <Globe size={16} />
                  Dimension: {currentLocation.dimension}
                </div>
                <div className={styles.locationDetail}>
                  <Users size={16} />
                  Residents: {currentLocation.residents.length}
                </div>
              </div>
            </div>
          )}
        </div>

        
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Play size={24} />
            Episodes ({episodes.length})
          </h2>
          
          <div className={styles.episodesList}>
            {episodes.map((episode) => (
              <div key={episode.id} className={styles.episodeItem}>
                <div className={styles.episodeName}>{episode.name}</div>
                <div className={styles.episodeCode}>{episode.episode}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail;