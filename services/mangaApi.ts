
import { API_BASE_URL } from '../constants';
import type { Manga, MangaDetail, ChapterDetail } from '../types';

interface MangaListResponse {
    manga_list: Manga[];
}

const handleResponse = async <T,>(response: Response): Promise<T> => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
};

export const getMangaList = async (page: number): Promise<Manga[]> => {
    const response = await fetch(`${API_BASE_URL}/manga/page/${page}`);
    const data = await handleResponse<MangaListResponse>(response);
    return data.manga_list || [];
};

export const getMangaDetail = async (endpoint: string): Promise<MangaDetail> => {
    const response = await fetch(`${API_BASE_URL}/manga/detail/${endpoint}`);
    return handleResponse<MangaDetail>(response);
};

export const getChapterDetail = async (endpoint: string): Promise<ChapterDetail> => {
    const response = await fetch(`${API_BASE_URL}/chapter/${endpoint}`);
    return handleResponse<ChapterDetail>(response);
};

export const searchManga = async (query: string): Promise<Manga[]> => {
    if (!query) return [];
    const response = await fetch(`${API_BASE_URL}/search/${query}`);
    const data = await handleResponse<MangaListResponse>(response);
    return data.manga_list || [];
};
