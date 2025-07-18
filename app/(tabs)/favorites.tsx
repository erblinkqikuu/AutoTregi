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
} from 'react-native';
import { Heart } from 'lucide-react-native';
import { VehicleCard } from '@/components/VehicleCard';
import { useTranslation } from '@/contexts/TranslationContext';
import { useAppContext } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { state } = useAppContext();
  const { theme } = useTheme();
  
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

  const fetchWishlistCars = async () => {
    if (!state.user?.id) {
      setError('User ID not available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Fetching wishlist for user ID:', state.user.id);
      
      const response = await fetch(`https://autotregi.com/api/user/dashboard?user_id=${state.user.id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DashboardApiResponse = await response.json();
      
      console.log('📊 Dashboard API Response:', data);
      console.log('📋 Wishlists:', data.wishlists);
      console.log('🚗 Total Cars:', data.cars.length);
      console.log('❤️ Total Wishlist Count:', data.total_wishlist_count);

      // Extract car_ids from wishlists
      const wishlistCarIds = data.wishlists.map(wishlist => wishlist.car_id);
      console.log('🎯 Wishlist Car IDs:', wishlistCarIds);

      // Fetch detailed information for each wishlist car
      if (wishlistCarIds.length === 0) {
        setWishlistCars([]);
        console.log('📭 No cars in wishlist');
        return;
      }

      console.log('🔄 Fetching detailed car information...');
      const carDetailsPromises = wishlistCarIds.map(async (carId) => {
        try {
          console.log(`📡 Fetching details for car ID: ${carId}`);
          const carResponse = await fetch(`https://autotregi.com/api/listing/${carId}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });

          if (!carResponse.ok) {
            console.warn(`⚠️ Failed to fetch car ${carId}: ${carResponse.status}`);
            return null;
          }

          const carData = await carResponse.json();
          console.log(`✅ Car ${carId} details:`, carData);
          
          // The API returns the car data directly or in a 'car' property
          const carInfo = carData.car || carData;
          return transformApiCarToVehicle(carInfo);
        } catch (error) {
          console.error(`❌ Error fetching car ${carId}:`, error);
          return null;
        }
      });

      // Wait for all car details to be fetched
      const carDetails = await Promise.all(carDetailsPromises);
      
      // Filter out any failed requests (null values)
      const validCarDetails = carDetails.filter(car => car !== null) as TransformedVehicle[];
      
      setWishlistCars(validCarDetails);
      console.log('🎯 Final wishlist cars:', validCarDetails);
      console.log(`✅ Successfully loaded ${validCarDetails.length} out of ${wishlistCarIds.length} wishlist cars`);

    } catch (err) {
      console.error('❌ Error fetching wishlist:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const transformApiCarToVehicle = (apiCar: ApiCar): TransformedVehicle => {
    // Transform image path
    const getImageUrl = (imagePath: string) => {
      if (!imagePath) return 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800';
      const cleanPath = imagePath.replace(/\\/g, '/');
      return cleanPath.startsWith('http') ? cleanPath : `https://autotregi.com/${cleanPath}`;
    };

    // Parse price
    const price = parseFloat(apiCar.offer_price?.replace(/[,\s]/g, '') || '0');

    // Parse mileage
    const mileage = parseFloat(apiCar.mileage?.replace(/[,\s]/g, '') || '0');

    // Parse year
    const year = parseInt(apiCar.year || '2020');

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
    const normalizeTransmission = (transmission: string): 'manual' | 'automatic' | 'cvt' => {
      const lower = transmission?.toLowerCase() || '';
      if (lower.includes('automatic') || lower.includes('auto')) return 'automatic';
      if (lower.includes('cvt')) return 'cvt';
      return 'manual';
    };

    // Normalize fuel type
    const normalizeFuelType = (fuelType?: string): 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'lpg' | 'cng' => {
      const lower = fuelType?.toLowerCase() || '';
      if (lower.includes('diesel')) return 'diesel';
      if (lower.includes('electric')) return 'electric';
      if (lower.includes('hybrid')) return 'hybrid';
      if (lower.includes('lpg')) return 'lpg';
      if (lower.includes('cng')) return 'cng';
      return 'gasoline';
    };

    // Normalize condition
    const normalizeCondition = (condition: string): 'new' | 'used' | 'damaged' => {
      const lower = condition?.toLowerCase() || '';
      if (lower.includes('new')) return 'new';
      if (lower.includes('damaged')) return 'damaged';
      return 'used';
    };

    return {
      id: apiCar.id.toString(),
      sellerId: apiCar.seller?.id || '1',
      seller: {
        id: apiCar.seller?.id || '1',
        name: apiCar.seller?.name || 'Seller',
        avatar: apiCar.seller?.avatar ? getImageUrl(apiCar.seller.avatar) : undefined,
        rating: apiCar.seller?.rating || 4.5,
        reviewCount: apiCar.seller?.review_count || 0,
        isVerified: apiCar.seller?.is_verified || false,
        location: apiCar.seller?.location || apiCar.address || apiCar.location || 'Tiranë, Shqipëri',
        memberSince: apiCar.seller?.member_since || 'Jan 2023',
        responseTime: apiCar.seller?.response_time,
        phone: apiCar.seller?.phone,
      },
      title: apiCar.title || 'Vehicle',
      description: apiCar.description || 'No description available',
      category: getCategory(apiCar.title || '', apiCar.brand?.name || ''),
      make: apiCar.brand?.name || 'Unknown',
      model: apiCar.title?.replace(apiCar.brand?.name || '', '').trim() || 'Unknown',
      year,
      price,
      currency: '€',
      condition: normalizeCondition(apiCar.condition),
      mileage,
      fuelType: normalizeFuelType(apiCar.fuel_type),
      transmission: normalizeTransmission(apiCar.transmission),
      location: apiCar.address || apiCar.location || 'Tiranë, Shqipëri',
      countryId: apiCar.country_id,
      cityId: apiCar.city_id,
      images: [getImageUrl(apiCar.thumb_image)],
      features: Array.isArray(apiCar.features) ? apiCar.features : [],
      isPromoted: apiCar.is_promoted || false,
      createdAt: new Date(apiCar.created_at || Date.now()),
      updatedAt: new Date(apiCar.created_at || Date.now()),
      views: apiCar.views || 0,
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
      <Text style={styles.emptySubtitle}>{error}</Text>
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

  if (loading) {
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
        ListEmptyComponent={error ? renderError : renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={fetchWishlistCars}
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