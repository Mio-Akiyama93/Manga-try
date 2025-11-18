// types/consumetTypes.ts
// Note: These types are for the MangaDex provider.

// A helper type for titles and descriptions that can be multilingual
type LocalizedString = string | { [key: string]: string };

// For search results from /manga/mangadex/{query}
export interface ConsumetMangaResult {
  id: string;
  title: LocalizedString;
  altTitles: LocalizedString[];
  description: LocalizedString;
  status: string;
  releaseDate: number | string | null;
  contentRating: string;
  lastVolume?: string | null;
  lastChapter?: string | null;
  image: string;
  headerForImage?: { [key: string]: string };
}

// For manga details from /manga/mangadex/info/{id}
export interface ConsumetMangaInfo {
  id: string;
  title: LocalizedString;
  altTitles?: LocalizedString[];
  description: LocalizedString;
  image: string;
  headerForImage?: { [key: string]: string };
  status: string;
  authors: string[];
  tags: string[]; // Genres are called 'tags' in MangaDex
  type?: string;
  chapters: ConsumetChapterSummary[];
  releaseDate?: number | string | null;
  contentRating?: string;
  lastVolume?: string | null;
  lastChapter?: string | null;
  [key: string]: any; // Allow other properties
}

// For chapter summaries within MangaInfo
export interface ConsumetChapterSummary {
  id: string;
  title: string;
  chapterNumber: string;
  [key: string]: any;
}

// For chapter pages from /manga/mangadex/read/{id}
export interface ConsumetChapterPage {
  img: string;
  page: number;
  headerForImage?: { [key:string]: string };
}
