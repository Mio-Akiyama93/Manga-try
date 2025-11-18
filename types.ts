
export interface Manga {
  title: string;
  thumb: string;
  type: string;
  updated_on: string;
  endpoint: string;
}

export interface MangaDetail {
  title: string;
  thumb: string;
  synopsis: string;
  status: string;
  author: string;
  genre_list: { genre_name: string }[];
  chapter: MangaChapterSummary[];
}

export interface MangaChapterSummary {
  chapter_title: string;
  chapter_endpoint: string;
}

export interface ChapterPage {
  chapter_image_link: string;
  image_number: number;
}

export interface ChapterDetail {
  chapter_image: ChapterPage[];
}

export type View = 'home' | 'detail' | 'reader';
