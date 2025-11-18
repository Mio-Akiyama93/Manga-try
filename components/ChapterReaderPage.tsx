import React from 'react';
import { useState, useEffect } from 'react';
import { getChapterDetail } from '../services/mangaApi';
import type { ChapterDetail } from '../types';
import Spinner from './Spinner';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface ChapterReaderPageProps {
  chapterId: string;
  chapterTitle: string;
  onBack: () => void;
}

const ChapterReaderPage: React.FC<ChapterReaderPageProps> = ({ chapterId, chapterTitle, onBack }) => {
  const [chapter, setChapter] = useState<ChapterDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapter = async () => {
      setIsLoading(true);
      setError(null);
      window.scrollTo(0, 0);
      try {
        const detail = await getChapterDetail(chapterId, chapterTitle);
        setChapter(detail);
      } catch (err) {
        setError('Failed to load chapter pages.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapter();
  }, [chapterId, chapterTitle]);

  return (
    <div className="bg-black min-h-screen">
      <div className="fixed top-0 left-0 right-0 bg-primary/80 backdrop-blur-sm shadow-lg z-10 p-2 flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-secondary hover:text-highlight transition-colors duration-300 px-4 py-2 rounded-md"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Details</span>
        </button>
        <span className="text-text-secondary text-sm pr-4 truncate max-w-xs">{chapter?.title || 'Reading Chapter'}</span>
      </div>

      <div className="pt-20">
        {isLoading && (
          <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
            <Spinner />
          </div>
        )}
        {error && <div className="text-center text-red-400 p-8">{error}</div>}
        
        <div className="flex flex-col items-center">
          {chapter?.pageUrls.map((url, index) => (
             <img
                key={url}
                src={url}
                alt={`Page ${index + 1}`}
                loading="lazy"
                className="max-w-full md:max-w-4xl w-full h-auto block"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/800/1200?grayscale'; }}
              />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChapterReaderPage;
