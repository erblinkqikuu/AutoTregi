import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ArrowUpDown } from 'lucide-react-native';
import { SearchBar } from '@/components/SearchBar';
import { CategoryTabs } from '@/components/CategoryTabs';
import { VehicleCard } from '@/components/VehicleCard';
import { FilterModal } from '@/components/FilterModal';
import { SortModal } from '@/components/SortModal';
import { PaginationControls } from '@/components/PaginationControls';
import { useTranslation } from '@/contexts/TranslationContext';
import { useAppContext } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useWishlist } from '@/hooks/useWishlist';
import { useVehicleSearch } from '@/hooks/useVehicleSearch';
import { VehicleCategory, SearchFilters } from '@/types';
import { useApiVehicles } from '@/hooks/useApiVehicles';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { addToSearchHistory } = useAppContext();
  const { theme } = useTheme();
  const { isWishlisted } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const CARS_PER_PAGE = 12;
  
  // Fetch vehicles from API
  const { 
    allVehicles,
    loadingAll,
    error, 
    fetchAllForFiltering,
  } = useApiVehicles();

  // Combine category selection with filters
  const combinedFilters = useMemo(() => ({
    ...filters,
    category: selectedCategory || filters.category
  }), [filters, selectedCategory]);

  const { filteredVehicles, getFilterSummary, getSortedVehicles } = useVehicleSearch(
    allVehicles,
    combinedFilters,
    searchQuery
  );

  const sortedVehicles = getSortedVehicles(sortBy as any);
  const filterSummary = getFilterSummary();

  // Client-side pagination
  const totalPages = Math.ceil(sortedVehicles.length / CARS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARS_PER_PAGE;
  const endIndex = startIndex + CARS_PER_PAGE;
  const paginatedVehicles = sortedVehicles.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, filters, sortBy]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleGoToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      addToSearchHistory(query);
    }
  };

  const handleFiltersPress = () => {
    // Ensure we have all vehicles loaded for filtering
    if (allVehicles.length === 0 && !loadingAll) {
      fetchAllForFiltering();
    }
    setShowFilterModal(true);
  };

  const handleApplyFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    // Reset category selection if category filter is applied
    if (newFilters.category) {
      setSelectedCategory(null);
    }
  };

  const handleResetFilters = () => {
    setFilters({});
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category: VehicleCategory | null) => {
    setSelectedCategory(category);
    // Clear category from filters if selecting via tabs
    if (filters.category) {
      setFilters(prev => ({ ...prev, category: undefined }));
    }
  };

  const handleVehiclePress = (vehicleId: string) => {
    router.push(`/vehicle/${vehicleId}`);
  };

  const handleSortPress = () => {
    setShowSortModal(true);
  };

  const getSortLabel = () => {
    const sortOption = [
      { key: 'date-desc', label: 'Newest' },
      { key: 'price-asc', label: 'Price ↑' },
      { key: 'price-desc', label: 'Price ↓' },
      { key: 'year-desc', label: 'Year ↓' },
      { key: 'year-asc', label: 'Year ↑' },
      { key: 'mileage-asc', label: 'Mileage ↑' },
      { key: 'mileage-desc', label: 'Mileage ↓' },
    ].find(option => option.key === sortBy);
    
    return sortOption?.label || 'Sort';
  };

  const renderVehicle = ({ item }: { item: typeof paginatedVehicles[0] }) => (
    <VehicleCard
      vehicle={{
        ...item,
        isFavorited: isWishlisted(item.id)
      }}
      onPress={() => handleVehiclePress(item.id)}
    />
  );

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image
            source={{ uri: 'https://autotregi.com/uploads/website-images/logo2-2025-06-17-11-06-05-8205.png' }}
            style={styles.logoSymbol}
            resizeMode="contain"
          />
          <Text style={styles.title}>Autotregi</Text>
        </View>
        <View style={styles.resultsRow}>
          <Text style={styles.subtitle}>
            Showing {startIndex + 1}-{Math.min(endIndex, sortedVehicles.length)} of {sortedVehicles.length} {sortedVehicles.length === 1 ? 'automjet' : 'automjete'}
          </Text>
          <TouchableOpacity style={styles.sortButton} onPress={handleSortPress}>
            <ArrowUpDown size={16} color={theme.colors.textTertiary} />
            <Text style={styles.sortButtonText}>{getSortLabel()}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <SearchBar
        onSearch={handleSearch}
        onFiltersPress={handleFiltersPress}
        activeFiltersCount={filterSummary.count}
        filters={combinedFilters}
      />
      <CategoryTabs
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {error ? (
        <>
          <Text style={styles.emptyTitle}>Connection Error</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
          <TouchableOpacity style={styles.clearFiltersButton} onPress={fetchAllForFiltering}>
            <Text style={styles.clearFiltersButtonText}>Try Again</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.emptyTitle}>{t('noResults')}</Text>
          <Text style={styles.emptySubtitle}>
            {allVehicles.length === 0 && !loadingAll 
              ? 'No vehicles available at the moment'
              : 'Try adjusting your search or filters to find what you\'re looking for'}
          </Text>
          {(searchQuery || filterSummary.count > 0) && (
            <TouchableOpacity 
              style={styles.clearFiltersButton}
              onPress={() => {
                setSearchQuery('');
                handleResetFilters();
                setCurrentPage(1);
              }}
            >
              <Text style={styles.clearFiltersButtonText}>Clear all filters</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      {loadingAll && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading all vehicles...</Text>
        </View>
      )}
      <FlatList
        data={paginatedVehicles}
        renderItem={renderVehicle}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshing={loadingAll}
        onRefresh={fetchAllForFiltering}
        ListFooterComponent={() => {
          // Show pagination when there are multiple pages
          if (totalPages <= 1) {
            return null;
          }
          
          return (
            <PaginationControls
              currentPage={currentPage}
              lastPage={totalPages}
              total={sortedVehicles.length}
              hasNextPage={currentPage < totalPages}
              hasPrevPage={currentPage > 1}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
              onGoToPage={handleGoToPage}
              loading={loadingAll}
            />
          );
        }}
      />

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        selectedSort={sortBy}
        onSortSelect={setSortBy}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: theme.colors.surface,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoSymbol: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
  },
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textTertiary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: theme.colors.inputBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sortButtonText: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 0,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  clearFiltersButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearFiltersButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
});