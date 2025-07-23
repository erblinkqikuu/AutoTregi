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

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'ADD_TO_SEARCH_HISTORY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  language: 'en',
  favorites: [],
  searchHistory: [],
  isLoading: true,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        favorites: [],
        searchHistory: [],
        isLoading: false,
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    case 'ADD_TO_SEARCH_HISTORY':
      const newHistory = [action.payload, ...state.searchHistory.filter(item => item !== action.payload)].slice(0, 10);
      return {
        ...state,
        searchHistory: newHistory,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { 
    isWishlisted, 
    addToWishlist, 
    removeFromWishlist, 
    refreshWishlist: refreshWishlistHook,
    loading: wishlistLoading 
  } = useWishlist();

  // Check for existing auth on app start
  useEffect(() => {
    const checkExistingAuth = () => {
      if (Platform.OS === 'web') {
        const accessToken = localStorage.getItem('access_token');
        const userData = localStorage.getItem('userData');
        
        if (accessToken && userData) {
          try {
            const user = JSON.parse(userData);
            dispatch({ type: 'LOGIN', payload: user });
          } catch (error) {
            console.error('Error parsing stored user data:', error);
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkExistingAuth();
  }, []);

  const login = (user: User) => {
    dispatch({ type: 'LOGIN', payload: user });
  };

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

  const setLanguage = (language: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
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

  return (
    <AppContext.Provider value={{
      state,
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
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};