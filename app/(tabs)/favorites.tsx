import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Heart } from 'lucide-react-native';
import { VehicleCard } from '@/components/VehicleCard';
import { useTranslation } from '@/contexts/TranslationContext';
import { useAppContext } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useWishlist } from '@/hooks/useWishlist';
import { router } from 'expo-router';

interface WishlistItem {
  id: number;
  user_id: number;
  car_id: number;
  created_at: string;
  updated_at: string;
}

interface ApiCar {
  id: number;
  title: string;
  brand: {
    name: string;
  };
  year: string;
  offer_price: string;
  mileage: string;
  transmission: string;
  condition: string;
  thumb_image: string;
  description?: string;
  fuel_type?: string;
  location?: string;
  address?: string;
  country_id?: number;
  city_id?: number;
  features?: string[];
  created_at: string;
  views?: number;
  is_promoted?: boolean;
  seller?: {
    id: string;
    name: string;
    phone?: string;
    avatar?: string;
    rating?: number;
    review_count?: number;
    is_verified?: boolean;
    location?: string;
    member_since?: string;
    response_time?: string;
  };
}

interface DashboardApiResponse {
  user: {
    id: number;
    // ... other user details
  };
  cars: ApiCar[];
  total_car: number;
  total_featured_car: number;
  total_wishlist_count: number;
  wishlists: WishlistItem[];
}

interface TransformedVehicle {
  id: string;
  sellerId: string;
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    location: string;
    memberSince: string;
    responseTime?: string;
    phone?: string;
  };
  title: string;
  description: string;
  category: 'car' | 'motorcycle' | 'truck' | 'large-vehicle';
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  condition: 'new' | 'used' | 'damaged';
  mileage: number;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'lpg' | 'cng';
  transmission: 'manual' | 'automatic' | 'cvt';
  location: string;
  countryId?: number;
  cityId?: number;
  images: string[];
  features: string[];
  isPromoted: boolean;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  isFavorited: boolean;
}

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const { state, refreshWishlist } = useAppContext();
  const { theme } = useTheme();
  const { 
    wishlistedCarIds, 
    loading: wishlistLoading, 
    error: wishlistError,
    refreshWishlist: refreshWishlistHook 
  } = useWishlist();
  
  const [wishlistCars, setWishlistCars] = useState<TransformedVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state.isAuthenticated && state.user?.id) {
      fetchWishlistCars();
    } else {
      setLoading(false);
    }
  }, [state.isAuthenticated, state.user?.id]);

  // Refresh when wishlist changes
  useEffect(() => {
    if (state.isAuthenticated && wishlistedCarIds.length >= 0) {
      fetchWishlistCars();
    }
  }, [wishlistedCarIds, state.isAuthenticated]);
  const fetchWishlistCars = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get auth token from localStorage
      const accessToken = Platform.OS === 'web' ? localStorage.getItem('access_token') : null;
      
      if (!accessToken) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      console.log('🔄 Fetching wishlist cars...');
      
      const response = await fetch('http://127.0.0.1:8000/api/user/wishlists', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('📊 Wishlist API Response:', data);
      console.log('🚗 Wishlist Cars:', data.cars);

      if (!data.cars || data.cars.length === 0) {
        setWishlistCars([]);
        console.log('📭 No cars in wishlist'); 
        return;
      }

      // Transform wishlist cars directly
      const transformedCars = data.cars.map(transformWishlistCarToVehicle);
      
      setWishlistCars(transformedCars);
      console.log('🎯 Final wishlist cars:', transformedCars);
      console.log(`✅ Successfully loaded ${transformedCars.length} wishlist cars`);

    } catch (err) {
      console.error('❌ Error fetching wishlist:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const transformWishlistCarToVehicle = (wishlistCar: any): TransformedVehicle => {
    // Transform image path
    const getImageUrl = (imagePath: string) => {
      if (!imagePath) return 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800';
      const cleanPath = imagePath.replace(/\\/g, '/');
      return cleanPath.startsWith('http') ? cleanPath : `https://autotregi.com/${cleanPath}`;
    };

    // Parse price
    const price = parseFloat(wishlistCar.offer_price?.replace(/[,\s]/g, '') || '0');

    // Parse mileage
    const mileage = 50000; // Default since wishlist API doesn't include mileage

    // Parse year
    const year = 2020; // Default since wishlist API doesn't include year

    // Determine category based on brand or title
    const getCategory = (title: string, brand: string): 'car' | 'motorcycle' | 'truck' | 'large-vehicle' => {
      const lowerTitle = title.toLowerCase();
      const lowerBrand = brand.toLowerCase();
      
      if (lowerTitle.includes('motorcycle') || lowerTitle.includes('bike') || 
          ['yamaha', 'honda', 'kawasaki', 'suzuki', 'ducati', 'bmw'].some(b => lowerBrand.includes(b) && (lowerTitle.includes('r1') || lowerTitle.includes('cbr') || lowerTitle.includes('ninja')))) {
        return 'motorcycle';
      }
      if (lowerTitle.includes('truck') || lowerTitle.includes('van') || lowerTitle.includes('crafter')) {
        return 'truck';
      }
      if (lowerTitle.includes('bus') || lowerTitle.includes('large')) {
        return 'large-vehicle';
      }
      return 'car';
    };

    // Normalize transmission
    const transmission = 'automatic'; // Default since wishlist API doesn't include transmission

    // Normalize fuel type
    const fuelType = 'gasoline'; // Default since wishlist API doesn't include fuel type

    // Normalize condition
    const normalizeCondition = (condition: string): 'new' | 'used' | 'damaged' => {
      const lower = condition?.toLowerCase() || '';
      if (lower.includes('new')) return 'new';
      if (lower.includes('damaged')) return 'damaged';
      return 'used';
    };

    return {
      id: wishlistCar.id.toString(),
      sellerId: '1', // Default seller ID
      seller: {
        id: '1',
        name: 'Seller',
        rating: 4.5,
        reviewCount: 0,
        isVerified: false,
        location: wishlistCar.address || 'Tiranë, Shqipëri',
        memberSince: 'Jan 2023',
      },
      title: wishlistCar.title || 'Vehicle',
      description: wishlistCar.description?.replace(/&lt;/g, '<').replace(/&gt;/g, '>') || 'No description available',
      category: getCategory(wishlistCar.title || '', wishlistCar.brand?.name || ''),
      make: wishlistCar.brand?.name || 'Unknown',
      model: wishlistCar.title?.replace(wishlistCar.brand?.name || '', '').trim() || 'Unknown',
      year,
      price,
      currency: '€',
      condition: normalizeCondition(wishlistCar.condition),
      mileage,
      fuelType,
      transmission,
      location: wishlistCar.address || 'Tiranë, Shqipëri',
      images: [getImageUrl(wishlistCar.thumb_image)],
      features: [],
      isPromoted: wishlistCar.is_featured === 'enable',
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      isFavorited: true, // Always true since these are wishlist items
    };
  };

  const handleVehiclePress = (vehicleId: string) => {
    router.push(`/vehicle/${vehicleId}`);
  };

  const renderVehicle = ({ item }: { item: TransformedVehicle }) => (
    <VehicleCard
      vehicle={item}
      onPress={() => handleVehiclePress(item.id)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Heart size={64} color={theme.colors.textTertiary} />
      <Text style={styles.emptyTitle}>{t('noFavorites')}</Text>
      <Text style={styles.emptySubtitle}>
        Save vehicles you're interested in by tapping the heart icon
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.emptyContainer}>
      <Heart size={64} color={theme.colors.textTertiary} />
      <Text style={styles.emptyTitle}>Failed to load wishlist</Text>
      <Text style={styles.emptySubtitle}>{error || wishlistError}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={fetchWishlistCars}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const styles = createStyles(theme);

  if (!state.isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Image
              source={{ uri: 'https://autotregi.com/uploads/website-images/logo2-2025-06-17-11-06-05-8205.png' }}
              style={styles.logoSymbol}
              resizeMode="contain"
            />
            <Text style={styles.title}>{t('favorites')}</Text>
          </View>
        </View>
        <View style={styles.authRequired}>
          <Text style={styles.authRequiredText}>
            Please login to view your wishlist
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading || wishlistLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Image
              source={{ uri: 'https://autotregi.com/uploads/website-images/logo2-2025-06-17-11-06-05-8205.png' }}
              style={styles.logoSymbol}
              resizeMode="contain"
            />
            <Text style={styles.title}>{t('favorites')}</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading your wishlist...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image
            source={{ uri: 'https://autotregi.com/uploads/website-images/logo2-2025-06-17-11-06-05-8205.png' }}
            style={styles.logoSymbol}
            resizeMode="contain"
          />
          <Text style={styles.title}>{t('favorites')}</Text>
        </View>
        <Text style={styles.subtitle}>
          {wishlistCars.length} {wishlistCars.length === 1 ? 'vehicle' : 'vehicles'} in your wishlist
        </Text>
      </View>

      <FlatList
        data={wishlistCars}
        renderItem={renderVehicle}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={(error || wishlistError) ? renderError : renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshing={loading || wishlistLoading}
        onRefresh={() => {
          refreshWishlistHook();
          fetchWishlistCars();
        }}
        ListFooterComponent={() => (
          wishlistCars.length > 0 ? (
            <View style={styles.footerSpacing} />
          ) : null
        )}
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
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
  listContent: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  footerSpacing: {
    height: 24,
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
  },
  authRequired: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  authRequiredText: {
    fontSize: 16,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});