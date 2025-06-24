import React, { useState, useEffect, useCallback } from 'react';
import { Episode } from '../../types/api';
import { api } from '../../services/api';
import EpisodeCard from './EpisodeCard';
import SearchBar from '../UI/SearchBar';
import LoadingSpinner from '../UI/LoadingSpinner';
import styles from './EpisodeGrid.module.css';

const EpisodeGrid: React.FC = () => {
  // statess intial and after
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState('');

  //  loadingzzz function
  const loadEpisodes = useCallback(async (pageNum: number, reset: boolean = false) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getEpisodes(pageNum, searchText || undefined);
      
      if (reset) {
        setEpisodes(data.results);
      } else {
        setEpisodes(prev => [...prev, ...data.results]);
      }
      
      setHasMore(!!data.info.next);
      
    } catch (err) {
      setError('Failed to load episodes');
      if (reset) setEpisodes([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchText, isLoading]);

  // Simple scroll 
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
    loadEpisodes(1, true);
  }, [searchText]);

  useEffect(() => {
    if (page > 1) {
      loadEpisodes(page);
    }
  }, [page, loadEpisodes]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Episodes</h1>
        <p className={styles.subtitle}>
          Explore every episode from the Rick and Morty universe
        </p>
        
        <div className={styles.controls}>
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder="Search episodes..."
          />
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <h3>Something went wrong!</h3>
          <p>{error}</p>
        </div>
      )}

      {episodes.length === 0 && !isLoading && !error && (
        <div className={styles.noResults}>
          <h3>No episodes found</h3>
          <p>Try different search terms</p>
        </div>
      )}

      {episodes.length > 0 && (
        <div className={styles.grid}>
          {episodes.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      )}

      {isLoading && (
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="large" />
          <p>Loading more episodes...</p>
        </div>
      )}

      {!hasMore && episodes.length > 0 && (
        <div className={styles.endMessage}>
          <p>You've seen all episodes! 📺</p>
        </div>
      )}
    </div>
  );
};

export default EpisodeGrid;