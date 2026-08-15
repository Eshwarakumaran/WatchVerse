import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WatchlistItem {
  id: number;
  title: string;
  poster: string;
  score: string;
  summary: string;
  type: 'tv' | 'anime';
  extra: any;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const savedWatchlist = await AsyncStorage.getItem('@WatchVerse:watchlist');
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
    } catch (error) {
      console.error('Error loading watchlist:', error);
    }
  };

  const saveWatchlist = async (newWatchlist: WatchlistItem[]) => {
    try {
      await AsyncStorage.setItem('@WatchVerse:watchlist', JSON.stringify(newWatchlist));
      setWatchlist(newWatchlist);
    } catch (error) {
      console.error('Error saving watchlist:', error);
    }
  };

  const addToWatchlist = (item: WatchlistItem) => {
    const newWatchlist = [...watchlist, item];
    saveWatchlist(newWatchlist);
  };

  const removeFromWatchlist = (id: number) => {
    const newWatchlist = watchlist.filter(item => item.id !== id);
    saveWatchlist(newWatchlist);
  };

  const isInWatchlist = (id: number) => {
    return watchlist.some(item => item.id === id);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
