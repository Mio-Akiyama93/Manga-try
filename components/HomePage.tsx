import React from 'react';
import { useState, useEffect } from 'react';
import { getHomePageManga, searchManga } from '../services/mangaApi';
import type { Manga } from '../types';
import MangaCard from './MangaCard';
import Spinner from './Spinner';
import SearchIcon from './icons/SearchIcon';

interface HomePageProps {
  onSelectManga: (id: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSelectManga }) => {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    const loadFeaturedManga = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const featuredList = await getHomePageManga();
        setMangaList(featuredList);
      } catch (err) {
        setError('Failed to fetch featured manga. The API might be down.');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only load featured manga if not in a search state
    if (!isSearching) {
      loadFeaturedManga();
    }
  }, [isSearching]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearching(true);
    setIsLoading(true);
    setError(null);
    setMangaList([]);
    try {
        const results = await searchManga(query);
        setMangaList(results);
    } catch (err) {
        setError('Failed to perform search.');
    } finally {
        setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false); // This will trigger the useEffect to load featured manga
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-highlight tracking-tight">MangaHook Reader</h1>
        <p className="text-lg text-text-secondary mt-2">Your Portal to Unlimited Stories</p>
      </header>

      <div className="mb-8 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for your favorite manga..."
            className="w-full bg-secondary border-2 border-accent focus:border-highlight focus:ring-0 rounded-full py-3 pl-5 pr-12 text-text-main placeholder-text-secondary transition-colors"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-highlight/80 hover:bg-highlight text-white transition-colors" aria-label="Search">
            <SearchIcon className="h-5 w-5"/>
          </button>
        </form>
        {isSearching && <button onClick={clearSearch} className="mt-4 w-full text-center text-highlight hover:underline">Clear Search & View Featured</button>}
      </div>

      {error && <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</p>}
      
      {!isSearching && !isLoading && <h2 className="text-2xl font-bold text-center mb-6">Featured Manga</h2>}

      {isLoading ? (
        <div className="py-10"><Spinner /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {mangaList.map((manga) => (
              <MangaCard key={manga.id} manga={manga} onSelectManga={onSelectManga} />
            ))}
          </div>
          {!isLoading && isSearching && mangaList.length === 0 && (
            <p className="text-center text-text-secondary mt-8">No results found for "{searchQuery}".</p>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
