import { Character, Location, Episode, ApiResponse, FilterOptions } from '../types/api';

const API_BASE = 'https://rickandmortyapi.com/api';

class RickMortyAPI {
  // Helper method to make API calls
  private async makeRequest<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Something went wrong: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw error;
    }
  }

  // filter ke sath kro search
  private buildUrl(endpoint: string, params: Record<string, string | number>): string {
    const url = new URL(`${API_BASE}${endpoint}`);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value.toString());
      }
    });
    
    return url.toString();
  }

  // API method
  async getCharacters(page: number = 1, filters: FilterOptions = {}): Promise<ApiResponse<Character>> {
    const url = this.buildUrl('/character', { page, ...filters });
    return this.makeRequest<ApiResponse<Character>>(url);
  }

  
  async getCharacter(id: number): Promise<Character> {
    return this.makeRequest<Character>(`${API_BASE}/character/${id}`);
  }

  
  async getMultipleCharacters(ids: number[]): Promise<Character[]> {
    if (ids.length === 0) return [];
    
    if (ids.length === 1) {
      const character = await this.getCharacter(ids[0]);
      return [character];
    }
    
    return this.makeRequest<Character[]>(`${API_BASE}/character/${ids.join(',')}`);
  }


  async getLocations(page: number = 1, searchName?: string): Promise<ApiResponse<Location>> {
    const params: Record<string, string | number> = { page };
    if (searchName) params.name = searchName;
    
    const url = this.buildUrl('/location', params);
    return this.makeRequest<ApiResponse<Location>>(url);
  }

  
  async getLocation(id: number): Promise<Location> {
    return this.makeRequest<Location>(`${API_BASE}/location/${id}`);
  }

  
  async getLocationByUrl(url: string): Promise<Location> {
    return this.makeRequest<Location>(url);
  }

  // list of episodes
  async getEpisodes(page: number = 1, searchName?: string): Promise<ApiResponse<Episode>> {
    const params: Record<string, string | number> = { page };
    if (searchName) params.name = searchName;
    
    const url = this.buildUrl('/episode', params);
    return this.makeRequest<ApiResponse<Episode>>(url);
  }

  
  async getEpisode(id: number): Promise<Episode> {
    return this.makeRequest<Episode>(`${API_BASE}/episode/${id}`);
  }

  
  async getMultipleEpisodes(episodeUrls: string[]): Promise<Episode[]> {
    if (episodeUrls.length === 0) return [];
    
    const episodeIds = episodeUrls.map(url => {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    });

    if (episodeIds.length === 1) {
      const episode = await this.getEpisode(episodeIds[0]);
      return [episode];
    }

    return this.makeRequest<Episode[]>(`${API_BASE}/episode/${episodeIds.join(',')}`);
  }

  
  getIdFromUrl(url: string): number {
    const urlParts = url.split('/');
    return parseInt(urlParts[urlParts.length - 1]);
  }
}


export const api = new RickMortyAPI();