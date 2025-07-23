<<<<<<< HEAD
import React, { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from 'react';
import { AppState, Language, User } from '@/types';
import { useWishlist } from '@/hooks/useWishlist';
=======
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import { useWishlist } from '@/hooks/useWishlist';
import { User, Language, AppState } from '@/types';
>>>>>>> ab07ba9c9a08229c2ea95638cd28ee76a13a2908

interface AppContextType {
  state: AppState;
  login: (user: User) => void;
  logout: () => void;
  setLanguage: (language: Language) => void;
<<<<<<< HEAD
  addToFavorites: (vehicleId: string) => Promise<void>;
  removeFromFavorites: (vehicleId: string) => Promise<void>;
  isWishlisted: (vehicleId: string) => boolean;
  addToSearchHistory: (query: string) => void;
  initializeAuth: () => Promise<void>;
=======
  addToSearchHistory: (query: string) => void;
  addToFavorites: (vehicleId: string) => void;
  removeFromFavorites: (vehicleId: string) => void;
  refreshWishlist: () => void;
  wishlistLoading: boolean;
>>>>>>> ab07ba9c9a08229c2ea95638cd28ee76a13a2908
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
<<<<<<< HEAD
  const isMountedRef = useRef(false);
  const {
    isWishlisted,
    addToWishlist,
    removeFromWishlist,
    refreshWishlist,
  } = useWishlist();

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
=======
  const { 
    addToWishlist, 
    removeFromWishlist, 
    refreshWishlist: refreshWishlistHook,
    loading: wishlistLoading 
  } = useWishlist();
>>>>>>> ab07ba9c9a08229c2ea95638cd28ee76a13a2908

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

<<<<<<< HEAD
  const logout = async () => {
    safeDispatch({ type: 'LOGOUT' });
    // Clear localStorage on logout
    if (typeof window !== 'undefined' && window.localStorage) {
=======
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    
    // Clear localStorage on web
    if (Platform.OS === 'web') {
>>>>>>> ab07ba9c9a08229c2ea95638cd28ee76a13a2908
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('expires_in');
      localStorage.removeItem('token_created_at');
      localStorage.removeItem('userData');
    }
<<<<<<< HEAD
    // Refresh wishlist to clear it
    await refreshWishlist();
  };

  const setLanguage = (language: Language) => {
    safeDispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const addToFavorites = async (vehicleId: string) => {
    try {
      await addToWishlist(vehicleId);
      safeDispatch({ type: 'ADD_TO_FAVORITES', payload: vehicleId });
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      throw error;
    }
  };

  const removeFromFavorites = async (vehicleId: string) => {
    try {
      await removeFromWishlist(vehicleId);
      safeDispatch({ type: 'REMOVE_FROM_FAVORITES', payload: vehicleId });
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      throw error;
    }
=======
  };

  const setLanguage = (language: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
>>>>>>> ab07ba9c9a08229c2ea95638cd28ee76a13a2908
  };

  const addToSearchHistory = (query: string) => {
    dispatch({ type: 'ADD_TO_SEARCH_HISTORY', payload: query });
  };


  return (
<<<<<<< HEAD
    <AppContext.Provider
      value={{
        state,
        login,
        logout,
        setLanguage,
        addToFavorites,
        removeFromFavorites,
        isWishlisted,
        addToSearchHistory,
        initializeAuth,
      }}
    >
=======
    <AppContext.Provider value={{
      state,
      login,
      logout,
      setLanguage,
      addToSearchHistory,
    }}>
>>>>>>> ab07ba9c9a08229c2ea95638cd28ee76a13a2908
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