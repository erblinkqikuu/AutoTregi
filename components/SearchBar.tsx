import React, { useState, useRef } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Text,
  Animated,
  Dimensions,
} from 'react-native';
import { Search, SlidersHorizontal, X, Clock, TrendingUp } from 'lucide-react-native';
import { useTranslation } from '@/contexts/TranslationContext';
import { useAppContext } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { SearchFilters } from '@/types';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFiltersPress: () => void;
  placeholder?: string;
  activeFiltersCount?: number;
  filters?: SearchFilters;
}

const { width } = Dimensions.get('window');

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFiltersPress,
  placeholder,
  activeFiltersCount = 0,
  filters,
}) => {
  const { t } = useTranslation();
  const { state, addToSearchHistory } = useAppContext();
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const popularSearches = [
    'BMW X5',
    'Mercedes C-Class',
    'Audi A4',
    'Toyota Corolla',
    'Honda Civic',
    'Volkswagen Golf',
  ];

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
    Animated.timing(animatedHeight, {
      toValue: 200,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => {
      setShowSuggestions(false);
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, 150);
  };

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      addToSearchHistory(finalQuery);
      onSearch(finalQuery);
      setQuery(finalQuery);
    }
    handleBlur();
  };

  const handleClearSearch = () => {
    setQuery('');
    onSearch('');
  };

  const handleSuggestionPress = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const renderSuggestionItem = ({ item, index }: { item: string; index: number }) => {
    const isHistory = index < state.searchHistory.length;
    
    return (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => handleSuggestionPress(item)}
      >
        <View style={styles.suggestionIcon}>
          {isHistory ? (
            <Clock size={16} color={theme.colors.textTertiary} />
          ) : (
            <TrendingUp size={16} color={theme.colors.textTertiary} />
          )}
        </View>
        <Text style={styles.suggestionText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const getSuggestions = () => {
    const filteredHistory = state.searchHistory.filter(item =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    
    const filteredPopular = popularSearches.filter(item =>
      item.toLowerCase().includes(query.toLowerCase()) &&
      !filteredHistory.includes(item)
    );

    return [...filteredHistory.slice(0, 3), ...filteredPopular.slice(0, 3)];
  };

  const getActiveFiltersText = () => {
    if (!filters || activeFiltersCount === 0) return '';
    
    const filterTexts = [];
    if (filters.category) filterTexts.push(t(filters.category));
    if (filters.make) filterTexts.push(filters.make);
    if (filters.minPrice || filters.maxPrice) {
      const priceText = `${filters.minPrice || 0}-${filters.maxPrice || '∞'} ${t('currency')}`;
      filterTexts.push(priceText);
    }
    
    return filterTexts.slice(0, 2).join(', ') + (filterTexts.length > 2 ? '...' : '');
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, isFocused && styles.searchInputContainerFocused]}>
          <Search size={20} color={theme.colors.textTertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder={placeholder || t('searchPlaceholder')}
            placeholderTextColor={theme.colors.inputPlaceholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <X size={18} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            activeFiltersCount > 0 && styles.filterButtonActive
          ]} 
          onPress={onFiltersPress}
        >
          <SlidersHorizontal size={20} color={activeFiltersCount > 0 ? '#FFFFFF' : theme.colors.primary} />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersText} numberOfLines={1}>
            {getActiveFiltersText()}
          </Text>
          <TouchableOpacity onPress={onFiltersPress}>
            <Text style={styles.editFiltersText}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search Suggestions */}
      {showSuggestions && (
        <Animated.View style={[styles.suggestionsContainer, { height: animatedHeight }]}>
          <View style={styles.suggestionsHeader}>
            <Text style={styles.suggestionsTitle}>
              {query ? 'Suggestions' : 'Recent & Popular'}
            </Text>
          </View>
          <FlatList
            data={getSuggestions()}
            renderItem={renderSuggestionItem}
            keyExtractor={(item, index) => `${item}-${index}`}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </Animated.View>
      )}
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: theme.isDark ? 0.3 : 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInputContainerFocused: {
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: theme.isDark ? 0.4 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: theme.colors.text,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  filterButton: {
    backgroundColor: theme.colors.primaryLight,
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  activeFiltersText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  editFiltersText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 72,
    left: 16,
    right: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: theme.isDark ? 0.4 : 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1001,
  },
  suggestionsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});