import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface PaginationControlsProps {
  currentPage: number;
  lastPage: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
  loading?: boolean;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  lastPage,
  total,
  hasNextPage,
  hasPrevPage,
  onPrevPage,
  onNextPage,
  onGoToPage,
  loading = false,
}) => {
  // Don't show pagination if there's only one page, no results, or fewer than 12 cars
  if (lastPage <= 1 || total === 0 || total < 12) {
    return null;
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(lastPage, startPage + maxPagesToShow - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <View style={styles.container}>
      {/* Results Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Page {currentPage} of {lastPage} • {total} total results
        </Text>
      </View>

      {/* Pagination Controls */}
      <View style={styles.controlsContainer}>
        {/* Previous Button */}
        <TouchableOpacity
          style={[
            styles.navButton,
            (!hasPrevPage || loading) && styles.navButtonDisabled,
          ]}
          onPress={onPrevPage}
          disabled={!hasPrevPage || loading}
        >
          <ChevronLeft 
            size={20} 
            color={(!hasPrevPage || loading) ? '#9CA3AF' : '#374151'} 
          />
          <Text 
            style={[
              styles.navButtonText,
              (!hasPrevPage || loading) && styles.navButtonTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        {/* Page Numbers */}
        <View style={styles.pageNumbersContainer}>
          {/* Show first page if not in range */}
          {pageNumbers[0] > 1 && (
            <>
              <TouchableOpacity
                style={styles.pageButton}
                onPress={() => onGoToPage(1)}
                disabled={loading}
              >
                <Text style={styles.pageButtonText}>1</Text>
              </TouchableOpacity>
              {pageNumbers[0] > 2 && (
                <Text style={styles.ellipsis}>...</Text>
              )}
            </>
          )}

          {/* Page number buttons */}
          {pageNumbers.map((page) => (
            <TouchableOpacity
              key={page}
              style={[
                styles.pageButton,
                page === currentPage && styles.pageButtonActive,
                loading && styles.pageButtonDisabled,
              ]}
              onPress={() => onGoToPage(page)}
              disabled={loading}
            >
              <Text
                style={[
                  styles.pageButtonText,
                  page === currentPage && styles.pageButtonTextActive,
                ]}
              >
                {page}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Show last page if not in range */}
          {pageNumbers[pageNumbers.length - 1] < lastPage && (
            <>
              {pageNumbers[pageNumbers.length - 1] < lastPage - 1 && (
                <Text style={styles.ellipsis}>...</Text>
              )}
              <TouchableOpacity
                style={styles.pageButton}
                onPress={() => onGoToPage(lastPage)}
                disabled={loading}
              >
                <Text style={styles.pageButtonText}>{lastPage}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.navButton,
            (!hasNextPage || loading) && styles.navButtonDisabled,
          ]}
          onPress={onNextPage}
          disabled={!hasNextPage || loading}
        >
          <Text 
            style={[
              styles.navButtonText,
              (!hasNextPage || loading) && styles.navButtonTextDisabled,
            ]}
          >
            Next
          </Text>
          <ChevronRight 
            size={20} 
            color={(!hasNextPage || loading) ? '#9CA3AF' : '#374151'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2b2b',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#525353',
    marginTop: 8,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#A3A3A3',
    fontWeight: '500',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#525353',
    backgroundColor: '#404141',
    gap: 4,
    minWidth: 80,
    justifyContent: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#363737',
    borderColor: '#404141',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  navButtonTextDisabled: {
    color: '#737373',
  },
  pageNumbersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  pageButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#525353',
    backgroundColor: '#404141',
  },
  pageButtonActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  pageButtonDisabled: {
    backgroundColor: '#363737',
    borderColor: '#404141',
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  pageButtonTextActive: {
    color: '#FFFFFF',
  },
  ellipsis: {
    fontSize: 14,
    color: '#737373',
    paddingHorizontal: 4,
  },
});