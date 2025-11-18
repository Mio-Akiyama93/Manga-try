
import React from 'react';
import type { Manga } from '../types';

interface MangaCardProps {
  manga: Manga;
  onSelectManga: (id: string) => void;
}

const MangaCard: React.FC<MangaCardProps> = ({ manga, onSelectManga }) => {
  return (
    <div
      className="bg-secondary rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-highlight/20 group"
      onClick={() => onSelectManga(manga.id)}
      role="button"
      tabIndex={0}
      aria-label={`Select ${manga.title}`}
      onKeyDown={(e) => e.key === 'Enter' && onSelectManga(manga.id)}
    >
      <div className="relative aspect-[2/3] w-full">
        <img
          src={manga.coverUrl}
          alt={manga.title}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/200/300?grayscale';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-text-main truncate group-hover:text-highlight transition-colors duration-300" title={manga.title}>
          {manga.title}
        </h3>
        <p className="text-xs text-text-secondary mt-1">{manga.type}</p>
      </div>
    </div>
  );
};

export default MangaCard;
