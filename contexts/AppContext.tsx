import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import { useWishlist } from '@/hooks/useWishlist';
import { User, Language, AppState } from '@/types';

interface AppContextType {
  state: AppState;
  login: (user: User) => void;
  logout: () => void;
  setLanguage: (language: Language) => void;
  addToSearchHistory: (query: string) => void;
  addToFavorites: (vehicleId: string) => void;
  removeFromFavorites: (vehicleId: string) => void;
  isWishlisted: (vehicleId: string) => boolean;
  refreshWishlist: () => void;
  wishlistLoading: boolean;
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { 
    isWishlisted, 
    addToWishlist, 
    removeFromWishlist, 
    refreshWishlist: refreshWishlistHook,
    loading: wishlistLoading 
  } = useWishlist();

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    
    // Clear localStorage on web
    if (Platform.OS === 'web') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('expires_in');
      localStorage.removeItem('token_created_at');
      localStorage.removeItem('userData');
    }
    
    // Refresh wishlist after logout to clear it
    refreshWishlistHook();
  };

  const addToSearchHistory = (query: string) => {
    dispatch({ type: 'ADD_TO_SEARCH_HISTORY', payload: query });
  };

  const addToFavorites = (vehicleId: string) => {
    addToWishlist(vehicleId);
  };

  const removeFromFavorites = (vehicleId: string) => {
    removeFromWishlist(vehicleId);
  };

  const refreshWishlist = () => {
    refreshWishlistHook();
  };

      login,
      logout,
      setLanguage,
      addToSearchHistory,
      addToFavorites,
      removeFromFavorites,
      isWishlisted,
      refreshWishlist,
      wishlistLoading,
    }}>
      {children}
    </AppContextProvider>
  );
};