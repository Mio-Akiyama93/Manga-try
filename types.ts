export interface Manga {
  id: string;
  title: string;
  coverUrl: string;
  type: string;
}

export interface MangaDetail {
  id: string;
  title: string;
  coverUrl: string;
  description: string;
  status: string;
  genres: string[];
  authors: string[];
  chapters: MangaChapterSummary[];
}

export interface MangaChapterSummary {
  id: string;
  title: string;
  chapterNumber: string | null;
}

export interface ChapterDetail {
  id: string;
  title: string;
  pageUrls: string[];
}

export type View = 'home' | 'detail' | 'reader';