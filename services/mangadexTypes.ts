// types/consumetTypes.ts
// Note: These types are for the MangaHere provider.

// For search results from /manga/mangahere/{query}
export interface ConsumetMangaResult {
  id: string;
  title: string;
  image: string;
  headerForImage?: { [key: string]: string };
  rating?: number | string;
  latestChapter?: string;
}

// For manga details from /manga/mangahere/info/{id}
export interface ConsumetMangaInfo {
  id: string;
  title: string;
  image: string;
  headerForImage?: { [key: string]: string };
  description: string;
  authors: string[];
  genres: string[];
  status: string;
  chapters: ConsumetChapterSummary[];
}

// For chapter summaries within MangaInfo
export interface ConsumetChapterSummary {
  id: string;
  title: string;
  releaseDate?: string;
}

// For chapter pages from /manga/mangahere/read/{id}
export interface ConsumetChapterPage {
  img: string;
  page: number;
  headerForImage?: { [key: string]: string };
}