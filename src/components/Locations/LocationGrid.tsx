import React, { useState, useEffect, useCallback } from 'react';
import { Location } from '../../types/api';
import { api } from '../../services/api';
import LocationCard from './LocationCard';
import SearchBar from '../UI/SearchBar';
import LoadingSpinner from '../UI/LoadingSpinner';
import styles from './LocationGrid.module.css';

const LocationGrid: React.FC = () => {
  // Simple state
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState('');

  // Simple load function
  const loadLocations = useCallback(async (pageNum: number, reset: boolean = false) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getLocations(pageNum, searchText || undefined);
      
      if (reset) {
        setLocations(data.results);
      } else {
        setLocations(prev => [...prev, ...data.results]);
      }
      
      setHasMore(!!data.info.next);
      
    } catch (err) {
      setError('Failed to load locations');
      if (reset) setLocations([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchText, isLoading]);

  // Simple scroll handler
  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
      if (hasMore && !isLoading) {
        setPage(prev => prev + 1);
      }
    }
  }, [hasMore, isLoading]);

  // Effects
  useEffect(() => {
    setPage(1);
    loadLocations(1, true);
  }, [searchText]);

  useEffect(() => {
    if (page > 1) {
      loadLocations(page);
    }
  }, [page, loadLocations]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Locations</h1>
        <p className={styles.subtitle}>
          Discover the vast multiverse of Rick and Morty locations
        </p>
        
        <div className={styles.controls}>
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder="Search locations..."
          />
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <h3>Something went wrong!</h3>
          <p>{error}</p>
        </div>
      )}

      {locations.length === 0 && !isLoading && !error && (
        <div className={styles.noResults}>
          <h3>No locations found</h3>
          <p>Try different search terms</p>
        </div>
      )}

      {locations.length > 0 && (
        <div className={styles.grid}>
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      )}

      {isLoading && (
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="large" />
          <p>Loading more locations...</p>
        </div>
      )}

      {!hasMore && locations.length > 0 && (
        <div className={styles.endMessage}>
          <p>You've seen all locations! 🌍</p>
        </div>
      )}
    </div>
  );
};

export default LocationGrid;