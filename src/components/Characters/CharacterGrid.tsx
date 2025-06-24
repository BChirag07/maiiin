import React, { useState, useEffect, useCallback } from 'react';
import { Character, FilterOptions } from '../../types/api';
import { api } from '../../services/api';
import CharacterCard from './CharacterCard';
import SearchBar from '../UI/SearchBar';
import FilterSelect from '../UI/FilterSelect';
import LoadingSpinner from '../UI/LoadingSpinner';
import styles from './CharacterGrid.module.css';

const CharacterGrid: React.FC = () => {
  // Simple state management
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Search and filters
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});

  // Simple filter options
  const statusOptions = [
    { value: 'alive', label: 'Alive' },
    { value: 'dead', label: 'Dead' },
    { value: 'unknown', label: 'Unknown' }
  ];

  const genderOptions = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'genderless', label: 'Genderless' },
    { value: 'unknown', label: 'Unknown' }
  ];

  // Simple function to load characters
  const loadCharacters = useCallback(async (pageNum: number, reset: boolean = false) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Prepare search filters
      const searchFilters = {
        ...filters,
        name: searchText || undefined
      };

      // Get data from API
      const data = await api.getCharacters(pageNum, searchFilters);
      
      // Update characters list
      if (reset) {
        setCharacters(data.results);
      } else {
        setCharacters(prev => [...prev, ...data.results]);
      }
      
      // Check if there are more pages
      setHasMore(!!data.info.next);
      
    } catch (err) {
      setError('Failed to load characters');
      if (reset) setCharacters([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchText, filters, isLoading]);

  // Simple infinite scroll function
  const handleScroll = useCallback(() => {
    // Check if user scrolled near bottom
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
      if (hasMore && !isLoading) {
        setPage(prev => prev + 1);
      }
    }
  }, [hasMore, isLoading]);

  // Load first page when component mounts or search/filters change
  useEffect(() => {
    setPage(1);
    loadCharacters(1, true);
  }, [searchText, filters]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      loadCharacters(page);
    }
  }, [page, loadCharacters]);

  // Add scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);


  const updateFilter = (filterKey: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value || undefined
    }));
  };

  
  const clearFilters = () => {
    setFilters({});
    setSearchText('');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Rick & Morty Characters</h1>
        <p className={styles.subtitle}>
          Explore the multiverse and discover all your favorite characters
        </p>
        
        {/* Simple search and filters */}
        <div className={styles.controls}>
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder="Search characters..."
          />
          
          <div className={styles.filters}>
            <span className={styles.filterLabel}>Filters:</span>
            
            <FilterSelect
              value={filters.status || ''}
              onChange={(value) => updateFilter('status', value)}
              options={statusOptions}
              placeholder="Status"
            />
            
            <FilterSelect
              value={filters.gender || ''}
              onChange={(value) => updateFilter('gender', value)}
              options={genderOptions}
              placeholder="Gender"
            />
            
            
            {(Object.keys(filters).length > 0 || searchText) && (
              <button 
                onClick={clearFilters}
                className={styles.clearButton}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

     
      {error && (
        <div className={styles.error}>
          <h3>Something went wrong!</h3>
          <p>{error}</p>
        </div>
      )}

    
      {characters.length === 0 && !isLoading && !error && (
        <div className={styles.noResults}>
          <h3>No characters found</h3>
          <p>Try different search terms or filters</p>
        </div>
      )}

      {/* Characters grid */}
      {characters.length > 0 && (
        <div className={styles.grid}>
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="large" />
          <p>Loading more characters...</p>
        </div>
      )}

      
      {!hasMore && characters.length > 0 && (
        <div className={styles.endMessage}>
          <p>You've seen all characters! 🎉</p>
        </div>
      )}
    </div>
  );
};

export default CharacterGrid;