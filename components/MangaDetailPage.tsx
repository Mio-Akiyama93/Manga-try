
import React from 'react';
import { useState, useEffect } from 'react';
import { getMangaDetail } from '../services/mangaApi';
import type { MangaDetail } from '../types';
import Spinner from './Spinner';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface MangaDetailPageProps {
  endpoint: string;
  onSelectChapter: (endpoint: string) => void;
  onBack: () => void;
}

const MangaDetailPage: React.FC<MangaDetailPageProps> = ({ endpoint, onSelectChapter, onBack }) => {
  const [manga, setManga] = useState<MangaDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const imageUrl = manga ? `https://images.weserv.nl/?url=${manga.thumb.replace('http://', 'https://')}` : '';

  useEffect(() => {
    const fetchManga = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const detail = await getMangaDetail(endpoint);
        setManga(detail);
      } catch (err) {
        setError('Failed to load manga details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchManga();
  }, [endpoint]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400 p-8">{error}</div>;
  }

  if (!manga) {
    return <div className="text-center text-text-secondary p-8">Manga not found.</div>;
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto p-4 md:p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-text-secondary hover:text-highlight transition-colors duration-300"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to List</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <img 
              src={imageUrl} 
              alt={manga.title} 
              className="w-full h-auto object-cover rounded-lg shadow-lg shadow-black/50"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/600?grayscale'; }}
            />
          </div>

          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold text-highlight mb-2">{manga.title}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
              <span><strong>Author:</strong> {manga.author}</span>
              <span><strong>Status:</strong> {manga.status}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {manga.genre_list.map((genre) => (
                <span key={genre.genre_name} className="bg-accent text-text-main text-xs font-semibold px-3 py-1 rounded-full">
                  {genre.genre_name}
                </span>
              ))}
            </div>
            <h2 className="text-xl font-semibold mb-2 border-b-2 border-accent pb-2">Synopsis</h2>
            <p className="text-text-main leading-relaxed mb-8">{manga.synopsis}</p>

            <h2 className="text-xl font-semibold mb-4 border-b-2 border-accent pb-2">Chapters</h2>
            <div className="max-h-96 overflow-y-auto bg-secondary p-4 rounded-lg shadow-inner">
              <ul className="space-y-2">
                {manga.chapter.map((chap) => (
                  <li key={chap.chapter_endpoint}>
                    <button
                      onClick={() => onSelectChapter(chap.chapter_endpoint)}
                      className="w-full text-left px-4 py-3 bg-accent hover:bg-highlight hover:text-white rounded-md transition-all duration-300"
                    >
                      {chap.chapter_title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaDetailPage;
