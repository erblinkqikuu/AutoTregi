import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Building2,
  Search,
  Star,
  Shield,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Car,
  ChevronRight,
  Filter,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useTranslation } from '@/contexts/TranslationContext';
import { useTheme } from '@/contexts/ThemeContext';

interface ApiDealer {
  id: number;
  name: string;
  username: string;
  designation?: string;
  image?: string;
  status: string;
  is_banned: string;
  is_dealer: number;
  address: string;
  email: string;
  phone: string;
  kyc_status: string;
  total_car: number;
}

interface ApiResponse {
  dealers: {
    current_page: number;
    data: ApiDealer[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export default function DealersScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'verified' | 'premium'>('all');
  const [dealers, setDealers] = useState<ApiDealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://autotregi.com/api/dealers', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.dealers && data.dealers.data && Array.isArray(data.dealers.data)) {
        setDealers(data.dealers.data);
      } else {
        console.warn('No dealers data found in API response');
        setDealers([]);
      }
    } catch (err) {
      console.error('Error fetching dealers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dealers');
      setDealers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter dealers based on search and filters
  const filteredDealers = useMemo(() => {
    let filtered = [...dealers];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(dealer =>
        dealer.name.toLowerCase().includes(query) ||
        dealer.address?.toLowerCase().includes(query) ||
        dealer.email?.toLowerCase().includes(query) ||
        dealer.phone?.toLowerCase().includes(query)
      );
    }

    // Apply verification filter
    if (selectedFilter === 'verified') {
      filtered = filtered.filter(dealer => dealer.kyc_status === 'enable');
    } else if (selectedFilter === 'premium') {
      filtered = filtered.filter(dealer => dealer.total_car >= 5 && dealer.kyc_status === 'enable');
    }

    // Sort by total cars (highest first)
    return filtered.sort((a, b) => {
      const carsA = a.total_car || 0;
      const carsB = b.total_car || 0;
      return carsB - carsA;
    });
  }, [dealers, searchQuery, selectedFilter]);

  const handleDealerPress = (dealerId: string) => {
    // Find the dealer to get the username/slug
    const dealer = filteredDealers.find(d => d.id.toString() === dealerId);
    if (dealer) {
      router.push(`/dealer/${dealer.username}`);
    }
  };

  const handleCall = (phone: string) => {
    const phoneUrl = `tel:${phone}`;
    Linking.openURL(phoneUrl).catch(() => {
      Alert.alert(t('error'), t('unableToCall'));
    });
  };

  const handleEmail = (email: string) => {
    const emailUrl = `mailto:${email}`;
    Linking.openURL(emailUrl).catch(() => {
      Alert.alert(t('error'), 'Unable to open email');
    });
  };

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';
    const cleanPath = imagePath.replace(/\\/g, '/');
    return cleanPath.startsWith('http') ? cleanPath : `https://autotregi.com/${cleanPath}`;
  };

  const renderFilterButton = (
    filter: 'all' | 'verified' | 'premium',
    label: string,
    count: number
  ) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.filterButtonTextActive,
        ]}
      >
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const renderDealerCard = ({ item }: { item: ApiDealer }) => (
    <TouchableOpacity
      style={styles.dealerCard}
      onPress={() => handleDealerPress(item.id.toString())}
    >
      {/* Header with Logo and Basic Info */}
      <View style={styles.dealerHeader}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: getImageUrl(item.image) }}
            style={styles.logo}
            defaultSource={{ uri: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }}
          />
          {item.kyc_status === 'enable' && (
            <View style={styles.verifiedBadge}>
              <Shield size={12} color="#059669" />
            </View>
          )}
        </View>

        <View style={styles.dealerMainInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.dealerName} numberOfLines={1}>
              {item.name}
            </Text>
            <ChevronRight size={20} color="#A3A3A3" />
          </View>

          <View style={styles.locationRow}>
            <MapPin size={14} color="#A3A3A3" />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.address}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Car size={16} color="#EF4444" />
          <Text style={styles.statLabel}>Total Cars</Text>
          <Text style={styles.statValue}>{item.total_car}</Text>
        </View>
        <View style={styles.statItem}>
          <Shield size={16} color="#EF4444" />
          <Text style={styles.statLabel}>Status</Text>
          <Text style={styles.statValue}>
            {item.kyc_status === 'enable' ? 'Verified' : 'Pending'}
          </Text>
        </View>
      </View>

      {/* Contact Info */}
      <View style={styles.contactInfo}>
        <View style={styles.contactItem}>
          <Phone size={14} color="#A3A3A3" />
          <Text style={styles.contactText}>{item.phone}</Text>
        </View>
        <View style={styles.contactItem}>
          <Mail size={14} color="#A3A3A3" />
          <Text style={styles.contactText} numberOfLines={1}>
            {item.email}
          </Text>
        </View>
      </View>

      {/* Contact Actions */}
      <View style={styles.contactActions}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleCall(item.phone)}
        >
          <Phone size={16} color="#EF4444" />
          <Text style={styles.contactButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleEmail(item.email)}
        >
          <Mail size={16} color="#EF4444" />
          <Text style={styles.contactButtonText}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => {
            const dealer = filteredDealers.find(d => d.id === item.id);
            if (dealer) {
              router.push(`/dealer/${dealer.username}`);
            }
          }}
        >
          <Building2 size={16} color="#FFFFFF" />
          <Text style={styles.viewButtonText}>View Dealer</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
          <Text style={styles.title}>{t('dealers')}</Text>
        </View>
        <Text style={styles.subtitle}>
          {filteredDealers.length} {filteredDealers.length === 1 ? 'dealer' : 'dealers'} found
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#A3A3A3" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('searchDealers')}
            placeholderTextColor="#737373"
          />
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filtersContainer}>
        {renderFilterButton('all', 'All', dealers.length)}
        {renderFilterButton('verified', 'Verified', dealers.filter(d => d.kyc_status === 'enable').length)}
        {renderFilterButton('premium', 'Premium', dealers.filter(d => d.total_car >= 5 && d.kyc_status === 'enable').length)}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Building2 size={64} color="#525353" />
      <Text style={styles.emptyTitle}>
        {error ? 'Failed to load dealers' : t('noDealers')}
      </Text>
      <Text style={styles.emptySubtitle}>
        {error ? error : 'Try adjusting your search or filters to find dealers'}
      </Text>
      {error ? (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchDealers}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      ) : searchQuery ? (
        <TouchableOpacity
          style={styles.clearSearchButton}
          onPress={() => setSearchQuery('')}
        >
          <Text style={styles.clearSearchButtonText}>Clear search</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#EF4444" />
      <Text style={styles.loadingText}>Loading dealers...</Text>
    </View>
  );

  const styles = createStyles(theme);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {renderLoading()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredDealers}
        renderItem={renderDealerCard}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={fetchDealers}
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
    marginBottom: 8,
  },
  logoSymbol: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: theme.colors.text,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: theme.colors.background,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textTertiary,
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 24,
  },
  dealerCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: theme.isDark ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dealerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  logoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.inputBackground,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  dealerMainInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dealerName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    marginLeft: 4,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  contactInfo: {
    marginBottom: 16,
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    gap: 6,
  },
  contactButtonText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  viewButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    color: theme.colors.text,
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 300,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  clearSearchButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearSearchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});