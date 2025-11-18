import { API_BASE_URL } from '../constants';
import type { Manga, MangaDetail, ChapterDetail, MangaChapterSummary } from '../types';
import type { ConsumetMangaResult, ConsumetMangaInfo, ConsumetChapterPage } from './mangadexTypes';

// --- Helper Functions ---

const createImageUrl = (url: string, headers: object | undefined): string => {
    // If the API URL is not set, we can't use the proxy.
    // This will likely result in broken images due to referrer restrictions.
    if (!url) return 'https://picsum.photos/400/600?grayscale';
    if (API_BASE_URL.includes('replace-with-your-vercel-deployment-url')) {
        console.warn("API_BASE_URL has not been set in constants.ts. Images may not load correctly.");
        return url;
    }
    
    // The consumet API has a built-in image proxy that handles required headers.
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

const mapConsumetToManga = (manga: ConsumetMangaResult): Manga => ({
    id: manga.id,
    title: manga.title,
    coverUrl: createImageUrl(manga.image, manga.headerForImage),
    type: 'Manga', // MangaHere API doesn't provide a type
});

// A curated list of popular manga to display on the home page using MangaHere IDs.
const FEATURED_MANGA_IDS = [
    'fullmetal_alchemist',
    'berserk',
    'one_piece',
    'vagabond',
    'kingdom',
    'vinland_saga',
    'jujutsu_kaisen',
    'solo_leveling',
    'chainsaw_man',
    'shingeki_no_kyojin', // Attack on Titan
    'onepunch_man',
    'monster',
];


// --- API Functions ---

export const getHomePageManga = async (): Promise<Manga[]> => {
    const promises = FEATURED_MANGA_IDS.map(id => 
        fetch(`${API_BASE_URL}/manga/mangahere/info/${id}`).then(res => res.json())
    );
    const results: ConsumetMangaInfo[] = await Promise.all(promises);
    return results.map(manga => ({
        id: manga.id,
        title: manga.title,
        coverUrl: createImageUrl(manga.image, manga.headerForImage),
        type: 'Manga', // MangaHere API doesn't provide a type
    }));
};

export const searchManga = async (query: string): Promise<Manga[]> => {
    if (!query) return [];
    const url = new URL(`${API_BASE_URL}/manga/mangahere/${encodeURIComponent(query)}`);
    
    const response = await fetch(url.toString());
    const data = await handleResponse<{ results: ConsumetMangaResult[] }>(response);
    return data.results.map(mapConsumetToManga);
};

export const getMangaDetail = async (id: string): Promise<MangaDetail> => {
    const url = `${API_BASE_URL}/manga/mangahere/info/${id}`;
    const response = await fetch(url);
    const manga = await handleResponse<ConsumetMangaInfo>(response);

    const chapters: MangaChapterSummary[] = manga.chapters?.map(chap => ({
        id: chap.id,
        title: chap.title,
        chapterNumber: null, // MangaHere provides full title, not just number
    })) || [];

    return {
        id: manga.id,
        title: manga.title,
        coverUrl: createImageUrl(manga.image, manga.headerForImage),
        description: manga.description,
        status: manga.status,
        genres: manga.genres || [],
        authors: manga.authors || [],
        chapters,
    };
};


export const getChapterDetail = async (id: string, title: string): Promise<ChapterDetail> => {
    const url = `${API_BASE_URL}/manga/mangahere/read/${id}`;
    const response = await fetch(url);
    const pages = await handleResponse<ConsumetChapterPage[]>(response);

    return {
        id,
        title,
        pageUrls: pages.map(page => createImageUrl(page.img, page.headerForImage)),
    };
};