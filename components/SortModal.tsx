import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { X, Check, ArrowUpDown } from 'lucide-react-native';

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  selectedSort: string;
  onSortSelect: (sortBy: string) => void;
}

export const SortModal: React.FC<SortModalProps> = ({
  visible,
  onClose,
  selectedSort,
  onSortSelect,
}) => {
  const sortOptions = [
    { key: 'date-desc', label: 'Newest First', description: 'Recently added listings' },
    { key: 'price-asc', label: 'Price: Low to High', description: 'Cheapest first' },
    { key: 'price-desc', label: 'Price: High to Low', description: 'Most expensive first' },
    { key: 'year-desc', label: 'Year: Newest First', description: 'Latest model year' },
    { key: 'year-asc', label: 'Year: Oldest First', description: 'Earliest model year' },
    { key: 'mileage-asc', label: 'Mileage: Low to High', description: 'Lowest mileage first' },
    { key: 'mileage-desc', label: 'Mileage: High to Low', description: 'Highest mileage first' },
  ];

  const handleSortSelect = (sortKey: string) => {
    onSortSelect(sortKey);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <ArrowUpDown size={24} color="#EF4444" />
            <Text style={styles.headerTitle}>Sort By</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortOption,
                selectedSort === option.key && styles.sortOptionActive,
              ]}
              onPress={() => handleSortSelect(option.key)}
            >
              <View style={styles.sortOptionContent}>
                <Text style={[
                  styles.sortOptionTitle,
                  selectedSort === option.key && styles.sortOptionTitleActive,
                ]}>
                  {option.label}
                </Text>
                <Text style={styles.sortOptionDescription}>
                  {option.description}
                </Text>
              </View>
              {selectedSort === option.key && (
                <Check size={20} color="#2563EB" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1c1c',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#2a2b2b',
    borderBottomWidth: 1,
    borderBottomColor: '#525353',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
    backgroundColor: '#404141',
    borderRadius: 8,
  },
  content: {
    flex: 1,
    backgroundColor: '#2a2b2b',
    marginTop: 8,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#404141',
  },
  sortOptionActive: {
    backgroundColor: '#2a2b2b',
  },
  sortOptionContent: {
    flex: 1,
  },
  sortOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  sortOptionTitleActive: {
    color: '#EF4444',
    fontWeight: '600',
  },
  sortOptionDescription: {
    fontSize: 12,
    color: '#A3A3A3',
  },
});