import { API_BASE_URL } from '../constants';
import type { Manga, MangaDetail, ChapterDetail, MangaChapterSummary } from '../types';
import type { ConsumetMangaResult, ConsumetMangaInfo, ConsumetChapterPage } from './mangadexTypes';

// --- Helper Functions ---

const createImageUrl = (url: string, headers: object | undefined): string => {
    if (!url) return 'https://picsum.photos/400/600?grayscale';
    if (API_BASE_URL.includes('replace-with-your-vercel-deployment-url')) {
        console.warn("API_BASE_URL has not been set in constants.ts. Images may not load correctly.");
        return url;
    }
    
    // For MangaDex, a direct link is often fine, but the proxy is a good fallback.
    // The consumet API has a built-in image proxy that handles required headers if any.
    const proxyUrl = new URL(`${API_BASE_URL}/utils/image-proxy`);
    proxyUrl.searchParams.append('url', url);
    if (headers) {
        proxyUrl.searchParams.append('headers', JSON.stringify(headers));
    }
    return proxyUrl.toString();
};

const handleResponse = async <T,>(response: Response): Promise<T> => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const getLocalizedString = (data: string | { [key: string]: string } | undefined, preferredLang = 'en'): string => {
    if (!data) return '';
    if (typeof data === 'string') return data;
    if (data[preferredLang]) return data[preferredLang];
    // Fallback to the first available language
    const firstKey = Object.keys(data)[0];
    return data[firstKey] || '';
};

const mapConsumetToManga = (manga: ConsumetMangaResult): Manga => ({
    id: manga.id,
    title: getLocalizedString(manga.title),
    coverUrl: createImageUrl(manga.image, manga.headerForImage),
    type: 'Manga',
});

// A curated list of popular manga to display on the home page using MangaDex IDs.
const FEATURED_MANGA_IDS = [
    'a1c7c817-4e59-43b7-9365-028bf155a35b', // One Piece
    '6574374a-12e0-46f7-b803-247c223c6b2a', // Berserk
    '515a6b7d-5e58-4545-927a-e49043236b56', // Vagabond
    '37f5cce0-8070-4ada-96e5-fa24b22334a9', // Kingdom
    '9d042674-4063-4971-b855-508535a39774', // Vinland Saga
    'a41a4c21-b512-46a2-9e19-58b6ac1b6c00', // Jujutsu Kaisen
    'c189b70b-118c-42ac-b08e-5b1b4458f338', // Solo Leveling
    'a77742b6-fe36-4020-a241-3d7da65a1112', // Chainsaw Man

    'a793ddc2-035b-436b-82a1-c01280b188c0', // Attack on Titan
    'c0f295b9-7b18-4981-8669-02dbb1c60f1b', // One-Punch Man
    '188a1c22-0545-4f4d-a957-b2484a0d81f1', // Monster
    '934336c2-0361-4560-a2c6-d3369d7b433c', // Fullmetal Alchemist
];

// --- API Functions ---

export const getHomePageManga = async (): Promise<Manga[]> => {
    const promises = FEATURED_MANGA_IDS.map(id => 
        fetch(`${API_BASE_URL}/manga/mangadex/info/${id}`).then(res => res.json())
    );
    const results: ConsumetMangaInfo[] = await Promise.all(promises);
    return results.map(manga => ({
        id: manga.id,
        title: getLocalizedString(manga.title),
        coverUrl: createImageUrl(manga.image, manga.headerForImage),
        type: manga.type || 'Manga',
    }));
};

export const searchManga = async (query: string): Promise<Manga[]> => {
    if (!query) return [];
    const url = new URL(`${API_BASE_URL}/manga/mangadex/${encodeURIComponent(query)}`);
    
    const response = await fetch(url.toString());
    const data = await handleResponse<{ results: ConsumetMangaResult[] }>(response);
    return data.results.map(mapConsumetToManga);
};

export const getMangaDetail = async (id: string): Promise<MangaDetail> => {
    const url = `${API_BASE_URL}/manga/mangadex/info/${id}`;
    const response = await fetch(url);
    const manga = await handleResponse<ConsumetMangaInfo>(response);

    const chapters: MangaChapterSummary[] = manga.chapters?.map(chap => {
        const title = `Chapter ${chap.chapterNumber}${chap.title ? `: ${chap.title}` : ''}`;
        return {
            id: chap.id,
            title: title.trim(),
            chapterNumber: chap.chapterNumber,
        };
    }) || [];

    return {
        id: manga.id,
        title: getLocalizedString(manga.title),
        coverUrl: createImageUrl(manga.image, manga.headerForImage),
        description: getLocalizedString(manga.description),
        status: manga.status,
        genres: manga.tags || [],
        authors: manga.authors || [],
        chapters,
    };
};

export const getChapterDetail = async (id: string, title: string): Promise<ChapterDetail> => {
    const url = `${API_BASE_URL}/manga/mangadex/read/${id}`;
    const response = await fetch(url);
    const pages = await handleResponse<ConsumetChapterPage[]>(response);

    return {
        id,
        title,
        pageUrls: pages.map(page => createImageUrl(page.img, page.headerForImage)),
    };
};
