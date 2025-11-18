
import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { getMangaList, searchManga } from '../services/mangaApi';
import type { Manga } from '../types';
import MangaCard from './MangaCard';
import Spinner from './Spinner';
import SearchIcon from './icons/SearchIcon';

interface HomePageProps {
  onSelectManga: (endpoint: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSelectManga }) => {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const observer = useRef<IntersectionObserver>();

  const loadManga = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const newList = await getMangaList(pageNum);
      if (newList.length === 0) {
        setHasMore(false);
      } else {
        setMangaList(prev => [...prev, ...newList]);
      }
    } catch (err) {
      setError('Failed to fetch manga. The API might be down or you might have a network issue.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchQuery) return;
    loadManga(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  const lastMangaElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !searchQuery) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, searchQuery]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setIsLoading(true);
    setError(null);
    try {
        const results = await searchManga(searchQuery);
        setMangaList(results);
        setHasMore(false);
    } catch (err) {
        setError('Failed to perform search.');
    } finally {
        setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setMangaList([]);
    setPage(1);
    setHasMore(true);
    setIsSearching(false);
    loadManga(1);
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
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-highlight/80 hover:bg-highlight text-white transition-colors">
            <SearchIcon className="h-5 w-5"/>
          </button>
        </form>
        {isSearching && <button onClick={clearSearch} className="mt-4 w-full text-center text-highlight hover:underline">Clear Search Results</button>}
      </div>

      {error && <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</p>}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {mangaList.map((manga, index) => {
          if (mangaList.length === index + 1) {
            return <div ref={lastMangaElementRef} key={manga.endpoint}><MangaCard manga={manga} onSelectManga={onSelectManga} /></div>
          }
          return <MangaCard key={manga.endpoint} manga={manga} onSelectManga={onSelectManga} />
        })}
      </div>

      {isLoading && <div className="py-10"><Spinner /></div>}
      {!isLoading && !hasMore && !searchQuery && mangaList.length > 0 && <p className="text-center text-text-secondary mt-8">You've reached the end!</p>}
      {!isLoading && isSearching && mangaList.length === 0 && <p className="text-center text-text-secondary mt-8">No results found for "{searchQuery}".</p>}
    </div>
  );
};

export default HomePage;
