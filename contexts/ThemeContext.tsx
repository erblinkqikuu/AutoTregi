import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export interface Colors {
  // Background colors
  background: string;
  surface: string;
  card: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Border and divider colors
  border: string;
  divider: string;
  
  // Input colors
  inputBackground: string;
  inputBorder: string;
  inputPlaceholder: string;
  
  // Shadow colors
  shadow: string;
  
  // Special colors
  overlay: string;
  disabled: string;
  
  // Tab bar colors
  tabBarBackground: string;
  tabBarActive: string;
  tabBarInactive: string;
}

export interface Theme {
  colors: Colors;
  isDark: boolean;
}

const darkColors: Colors = {
  background: '#1b1c1c',
  surface: '#2a2b2b',
  card: '#363737',
  
  text: '#FFFFFF',
  textSecondary: '#E5E5E5',
  textTertiary: '#A3A3A3',
  
  primary: '#EF4444',
  primaryLight: '#7F1D1D',
  primaryDark: '#F87171',
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#F87171',
  info: '#60A5FA',
  
  border: '#525353',
  divider: '#404141',
  
  inputBackground: '#404141',
  inputBorder: '#525353',
  inputPlaceholder: '#737373',
  
  shadow: '#000000',
  
  overlay: 'rgba(0, 0, 0, 0.8)',
  disabled: '#737373',
  
  tabBarBackground: '#2a2b2b',
  tabBarActive: '#EF4444',
  tabBarInactive: '#A3A3A3',
};

export const darkTheme: Theme = {
  colors: darkColors,
  isDark: true,
};

interface ThemeState {
  theme: Theme;
  colorScheme: ColorSchemeName;
}

type ThemeAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_COLOR_SCHEME'; payload: ColorSchemeName };

const initialState: ThemeState = {
  theme: darkTheme,
  colorScheme: 'dark',
};

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    case 'SET_COLOR_SCHEME':
      return {
        ...state,
        colorScheme: 'dark', // Always force dark mode
        theme: darkTheme,
      };
    default:
      return state;
  }
};

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorSchemeName;
  setColorScheme: (scheme: ColorSchemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  useEffect(() => {
    // Always set to dark mode regardless of system preference
    dispatch({ type: 'SET_COLOR_SCHEME', payload: 'dark' });
  }, []);

  const setColorScheme = (scheme: ColorSchemeName) => {
    // Always force dark mode
    dispatch({ type: 'SET_COLOR_SCHEME', payload: 'dark' });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: state.theme,
        colorScheme: 'dark',
        setColorScheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};