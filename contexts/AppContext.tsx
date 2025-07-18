import React, { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from 'react';
import { AppState, Language, User } from '@/types';

interface AppContextType {
  state: AppState;
  login: (user: User) => void;
  logout: () => void;
  setLanguage: (language: Language) => void;
  addToFavorites: (vehicleId: string) => void;
  removeFromFavorites: (vehicleId: string) => void;
  addToSearchHistory: (query: string) => void;
  initializeAuth: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'ADD_TO_FAVORITES'; payload: string }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'ADD_TO_SEARCH_HISTORY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  language: 'sq',
  favorites: [],
  searchHistory: [],
  isLoading: false,
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
        isLoading: false,
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    case 'ADD_TO_FAVORITES':
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter(id => id !== action.payload),
      };
    case 'ADD_TO_SEARCH_HISTORY':
      return {
        ...state,
        searchHistory: [action.payload, ...state.searchHistory.filter(q => q !== action.payload)].slice(0, 10),
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

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const isMountedRef = useRef(false);

  const safeDispatch = (action: AppAction) => {
    if (isMountedRef.current) {
      dispatch(action);
    }
  };

  const initializeAuth = async () => {
    // Check for saved user data on app start
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedToken = localStorage.getItem('authToken');
        const savedUserData = localStorage.getItem('userData');
        
        if (savedToken && savedUserData) {
          const userData = JSON.parse(savedUserData);
          console.log('Restored user data from localStorage:', userData);
          
          // Restore user session
          safeDispatch({ type: 'LOGIN', payload: userData });
          return;
        }
      }
    } catch (error) {
      console.error('Error restoring user session:', error);
    }
    
    safeDispatch({ type: 'SET_LOADING', payload: false });
  };

  useEffect(() => {
    isMountedRef.current = true;
    initializeAuth();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const login = (user: User) => {
    safeDispatch({ type: 'LOGIN', payload: user });
  };

  const logout = async () => {
    safeDispatch({ type: 'LOGOUT' });
  };

  const setLanguage = (language: Language) => {
    safeDispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const addToFavorites = (vehicleId: string) => {
    safeDispatch({ type: 'ADD_TO_FAVORITES', payload: vehicleId });
  };

  const removeFromFavorites = (vehicleId: string) => {
    safeDispatch({ type: 'REMOVE_FROM_FAVORITES', payload: vehicleId });
  };

  const addToSearchHistory = (query: string) => {
    safeDispatch({ type: 'ADD_TO_SEARCH_HISTORY', payload: query });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        login,
        logout,
        setLanguage,
        addToFavorites,
        removeFromFavorites,
        addToSearchHistory,
        initializeAuth,
      }}
    >
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