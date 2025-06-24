import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../services/api';

// Mock the global fetch function
global.fetch = vi.fn();

describe('Rick and Morty API Service', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
  });

  it('should successfully fetch characters', async () => {
    // Mock API response data
    const mockApiResponse = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [
        {
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
          type: '',
          gender: 'Male',
          origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
          location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
          image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
          episode: ['https://rickandmortyapi.com/api/episode/1'],
          url: 'https://rickandmortyapi.com/api/character/1',
          created: '2017-11-04T18:48:46.250Z'
        }
      ]
    };

    // Mock successful fetch response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    });

    // Call the API method
    const result = await api.getCharacters();
    
    // Check that we got the expected data
    expect(result).toEqual(mockApiResponse);
    
    // Check that fetch was called with the right URL
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/character?page=1')
    );
  });

  it('should handle API errors properly', async () => {
    // Mock failed fetch response
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    // Expect the API call to throw an error
    await expect(api.getCharacters()).rejects.toThrow('Something went wrong: 404');
  });

  it('should fetch a single character by ID', async () => {
    // Mock character data
    const mockCharacter = {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
      location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      episode: ['https://rickandmortyapi.com/api/episode/1'],
      url: 'https://rickandmortyapi.com/api/character/1',
      created: '2017-11-04T18:48:46.250Z'
    };

    // Mock successful fetch response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCharacter
    });

    // Call the API method
    const result = await api.getCharacter(1);
    
    // Check that we got the expected character
    expect(result).toEqual(mockCharacter);
    
    // Check that fetch was called with the right URL
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/character/1')
    );
  });

  it('should extract ID from URL correctly', () => {
    const testUrl = 'https://rickandmortyapi.com/api/character/1';
    const extractedId = api.getIdFromUrl(testUrl);
    expect(extractedId).toBe(1);
  });
});