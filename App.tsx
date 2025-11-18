
import React from 'react';
import { useState, useCallback } from 'react';
import HomePage from './components/HomePage';
import MangaDetailPage from './components/MangaDetailPage';
import ChapterReaderPage from './components/ChapterReaderPage';
import type { View } from './types';

interface AppState {
  view: View;
  mangaEndpoint: string | null;
  chapterEndpoint: string | null;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'home',
    mangaEndpoint: null,
    chapterEndpoint: null,
  });

  const handleSelectManga = useCallback((endpoint: string) => {
    setState({
      view: 'detail',
      mangaEndpoint: endpoint,
      chapterEndpoint: null,
    });
  }, []);

  const handleSelectChapter = useCallback((endpoint: string) => {
    setState(prevState => ({
      ...prevState,
      view: 'reader',
      chapterEndpoint: endpoint,
    }));
  }, []);

  const handleBackToHome = useCallback(() => {
    setState({
      view: 'home',
      mangaEndpoint: null,
      chapterEndpoint: null,
    });
  }, []);
  
  const handleBackToDetail = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      view: 'detail',
      chapterEndpoint: null,
    }));
  }, []);

  const renderContent = () => {
    switch (state.view) {
      case 'detail':
        return state.mangaEndpoint ? (
          <MangaDetailPage
            endpoint={state.mangaEndpoint}
            onSelectChapter={handleSelectChapter}
            onBack={handleBackToHome}
          />
        ) : null;
      case 'reader':
        return state.chapterEndpoint ? (
          <ChapterReaderPage
            endpoint={state.chapterEndpoint}
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
