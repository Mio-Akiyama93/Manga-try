import React from 'react';
import { useState, useCallback } from 'react';
import HomePage from './components/HomePage';
import MangaDetailPage from './components/MangaDetailPage';
import ChapterReaderPage from './components/ChapterReaderPage';
import type { View } from './types';

interface AppState {
  view: View;
  mangaId: string | null;
  chapterId: string | null;
  chapterTitle: string | null;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'home',
    mangaId: null,
    chapterId: null,
    chapterTitle: null,
  });

  const handleSelectManga = useCallback((id: string) => {
    setState({
      view: 'detail',
      mangaId: id,
      chapterId: null,
      chapterTitle: null,
    });
  }, []);

  const handleSelectChapter = useCallback((id: string, title: string) => {
    setState(prevState => ({
      ...prevState,
      view: 'reader',
      chapterId: id,
      chapterTitle: title,
    }));
  }, []);

  const handleBackToHome = useCallback(() => {
    setState({
      view: 'home',
      mangaId: null,
      chapterId: null,
      chapterTitle: null,
    });
  }, []);
  
  const handleBackToDetail = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      view: 'detail',
      chapterId: null,
      chapterTitle: null,
    }));
  }, []);

  const renderContent = () => {
    switch (state.view) {
      case 'detail':
        return state.mangaId ? (
          <MangaDetailPage
            mangaId={state.mangaId}
            onSelectChapter={handleSelectChapter}
            onBack={handleBackToHome}
          />
        ) : null;
      case 'reader':
        return state.chapterId && state.chapterTitle ? (
          <ChapterReaderPage
            chapterId={state.chapterId}
            chapterTitle={state.chapterTitle}
            onBack={handleBackToDetail}
          />
        ) : null;
      case 'home':
      default:
        return <HomePage onSelectManga={handleSelectManga} />;
    }
  };

  return <main>{renderContent()}</main>;
};

export default App;
