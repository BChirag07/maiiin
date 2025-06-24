import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CharacterCard from '../components/Characters/CharacterCard';
import { Character } from '../types/api';

// Mock the navigate function from React Router
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Sample character data for testing
const testCharacter: Character = {
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

describe('CharacterCard Component', () => {
  it('displays character information correctly', () => {
    render(
      <BrowserRouter>
        <CharacterCard character={testCharacter} />
      </BrowserRouter>
    );

    // Check that all character info is displayed
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
    expect(screen.getByText('Alive')).toBeInTheDocument();
  });

  it('navigates to character detail page when clicked', () => {
    render(
      <BrowserRouter>
        <CharacterCard character={testCharacter} />
      </BrowserRouter>
    );

    // Find the card and click it
    const characterCard = screen.getByText('Rick Sanchez').closest('div');
    fireEvent.click(characterCard!);

    // Check that navigation was called with the right path
    expect(mockNavigate).toHaveBeenCalledWith('/character/1');
  });

  it('shows correct status badge color for alive character', () => {
    render(
      <BrowserRouter>
        <CharacterCard character={testCharacter} />
      </BrowserRouter>
    );

    // Check that the status badge has the right CSS class
    const statusBadge = screen.getByText('Alive');
    expect(statusBadge).toHaveClass('statusAlive');
  });
});