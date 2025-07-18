import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Shield,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Car,
  ChevronRight,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Eye,
  Heart,
  ChevronLeft,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from '@/contexts/TranslationContext';
import { useAppContext } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { VehicleCard } from '@/components/VehicleCard';

interface DealerDetails {
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
  total_dealer_rating?: number;
  about_me?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

interface DealerCar {
  id: number;
  title: string;
  slug: string;
  thumb_image: string;
  offer_price: string;
  regular_price?: string;
  condition: string;
  purpose: string;
  brand: {
    name: string;
  };
  year: string;
  mileage: string;
  views?: number;
}

interface DealerApiResponse {
  dealer: DealerDetails;
  cars: {
    current_page: number;
    data: DealerCar[];
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

export default function DealerDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { t } = useTranslation();
  const { state, addToFavorites, removeFromFavorites } = useAppContext();
  const { theme } = useTheme();
  
  const [dealerData, setDealerData] = useState<DealerApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingCars, setLoadingCars] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchDealerDetails();
    }
  }, [slug]);

  const fetchDealerDetails = async (page: number = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingCars(true);
      }
      setError(null);
      
      const url = page > 1 
        ? `https://autotregi.com/api/dealer/${slug}?page=${page}`
        : `https://autotregi.com/api/dealer/${slug}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DealerApiResponse = await response.json();
      
      if (data.dealer) {
        if (page === 1) {
          setDealerData(data);
          setCurrentPage(1);
        } else {
          // Append new cars to existing data for pagination
          setDealerData(prev => prev ? {
            ...prev,
            cars: {
              ...data.cars,
              data: [...prev.cars.data, ...data.cars.data]
            }
          } : data);
          setCurrentPage(page);
        }
      } else {
        throw new Error('Dealer not found');
      }
    } catch (err) {
      console.error('Error fetching dealer details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dealer details');
    } finally {
      setLoading(false);
      setLoadingCars(false);
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

  const handleWebsite = (website: string) => {
    const url = website.startsWith('http') ? website : `https://${website}`;
    Linking.openURL(url).catch(() => {
      Alert.alert(t('error'), 'Unable to open website');
    });
  };

  const handleSocialMedia = (platform: string, url: string) => {
    const socialUrl = url.startsWith('http') ? url : `https://${url}`;
    Linking.openURL(socialUrl).catch(() => {
      Alert.alert(t('error'), `Unable to open ${platform}`);
    });
  };

  const handleCarPress = (carId: number) => {
    router.push(`/vehicle/${carId}`);
  };

  const handleFavoritePress = (carId: number) => {
    const isFavorited = state.favorites.includes(carId.toString());
    if (isFavorited) {
      removeFromFavorites(carId.toString());
    } else {
      addToFavorites(carId.toString());
    }
  };

  const loadMoreCars = () => {
    if (dealerData?.cars.next_page_url && !loadingCars) {
      fetchDealerDetails(currentPage + 1);
    }
  };

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';
    const cleanPath = imagePath.replace(/\\/g, '/');
    return cleanPath.startsWith('http') ? cleanPath : `https://autotregi.com/${cleanPath}`;
  };


  const renderOperatingHours = () => {
    if (!dealerData?.dealer) return null;

    const days = [
      { key: 'monday', label: 'Monday' },
      { key: 'tuesday', label: 'Tuesday' },
      { key: 'wednesday', label: 'Wednesday' },
      { key: 'thursday', label: 'Thursday' },
      { key: 'friday', label: 'Friday' },
      { key: 'saturday', label: 'Saturday' },
      { key: 'sunday', label: 'Sunday' },
    ];

    const hasAnyHours = days.some(day => dealerData.dealer[day as keyof DealerDetails]);

    if (!hasAnyHours) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Operating Hours</Text>
        <View style={styles.hoursContainer}>
          {days.map((day) => {
            const hours = dealerData.dealer[day.key as keyof DealerDetails] as string;
            return (
              <View key={day.key} style={styles.hourRow}>
                <Text style={styles.dayLabel}>{day.label}</Text>
                <Text style={styles.hourText}>
                  {hours || 'Closed'}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderSocialMedia = () => {
    if (!dealerData?.dealer) return null;

    const socialLinks = [
      { platform: 'facebook', url: dealerData.dealer.facebook, icon: Facebook, color: '#1877F2' },
      { platform: 'linkedin', url: dealerData.dealer.linkedin, icon: Linkedin, color: '#0A66C2' },
      { platform: 'twitter', url: dealerData.dealer.twitter, icon: Twitter, color: '#1DA1F2' },
      { platform: 'instagram', url: dealerData.dealer.instagram, icon: Instagram, color: '#E4405F' },
    ];

    const availableLinks = socialLinks.filter(link => link.url);

    if (availableLinks.length === 0) return null;

    return (
      <View style={styles.socialMediaContainer}>
        <Text style={styles.socialMediaTitle}>Follow Us</Text>
        <View style={styles.socialMediaButtons}>
          {availableLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <TouchableOpacity
                key={link.platform}
                style={[styles.socialButton, { backgroundColor: link.color }]}
                onPress={() => handleSocialMedia(link.platform, link.url!)}
              >
                <IconComponent size={20} color="#FFFFFF" />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  // Transform DealerCar to Vehicle format for VehicleCard component
  const transformDealerCarToVehicle = (dealerCar: DealerCar) => {
    return {
      id: dealerCar.id.toString(),
      sellerId: dealerData?.dealer.id.toString() || '1',
      seller: {
        id: dealerData?.dealer.id.toString() || '1',
        name: dealerData?.dealer.name || 'Dealer',
        avatar: dealerData?.dealer.image ? getImageUrl(dealerData.dealer.image) : undefined,
        rating: dealerData?.dealer.total_dealer_rating || 4.5,
        reviewCount: 0,
        isVerified: dealerData?.dealer.kyc_status === 'enable',
        location: dealerData?.dealer.address || 'Location',
        memberSince: 'Jan 2023',
        responseTime: '2 hours',
        phone: dealerData?.dealer.phone,
      },
      title: dealerCar.title,
      description: `${dealerCar.brand.name} ${dealerCar.title}`,
      category: 'car' as const,
      make: dealerCar.brand.name,
      model: dealerCar.title.replace(dealerCar.brand.name, '').trim(),
      year: parseInt(dealerCar.year) || 2020,
      price: parseFloat(dealerCar.offer_price?.replace(/[,\s]/g, '') || '0'),
      currency: '€',
      condition: dealerCar.condition.toLowerCase() as 'new' | 'used' | 'damaged',
      mileage: parseFloat(dealerCar.mileage?.replace(/[,\s]/g, '') || '0'),
      fuelType: 'gasoline' as const,
      transmission: 'manual' as const,
      location: dealerData?.dealer.address || 'Location',
      images: [getImageUrl(dealerCar.thumb_image)],
      features: [],
      isPromoted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: dealerCar.views || 0,
      isFavorited: state.favorites.includes(dealerCar.id.toString()),
    };
  };

  const styles = createStyles(theme);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dealer Details</Text>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EF4444" />
          <Text style={styles.loadingText}>Loading dealer details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !dealerData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dealer Details</Text>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Dealer Not Found</Text>
          <Text style={styles.errorText}>
            {error || 'The dealer you are looking for could not be found.'}
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { dealer, cars } = dealerData;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dealer Details</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Dealer Header Section */}
        <View style={styles.dealerHeader}>
          <View style={styles.dealerImageContainer}>
            <Image
              source={{ uri: getImageUrl(dealer.image) }}
              style={styles.dealerImage}
              defaultSource={{ uri: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }}
            />
            {dealer.kyc_status === 'enable' && (
              <View style={styles.verifiedBadge}>
                <Shield size={16} color="#059669" />
              </View>
            )}
          </View>
          
          <View style={styles.dealerInfo}>
            <Text style={styles.dealerName}>{dealer.name}</Text>
            <View style={styles.locationRow}>
              <MapPin size={16} color="#A3A3A3" />
              <Text style={styles.locationText}>{dealer.address}</Text>
            </View>
            {dealer.designation && (
              <Text style={styles.designation}>{dealer.designation}</Text>
            )}
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactGrid}>
            <TouchableOpacity style={styles.contactItem} onPress={() => handleCall(dealer.phone)}>
              <Phone size={20} color="#EF4444" />
              <Text style={styles.contactText}>{dealer.phone}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactItem} onPress={() => handleEmail(dealer.email)}>
              <Mail size={20} color="#EF4444" />
              <Text style={styles.contactText}>{dealer.email}</Text>
            </TouchableOpacity>
            {dealer.website && (
              <TouchableOpacity style={styles.contactItem} onPress={() => handleWebsite(dealer.website)}>
                <Globe size={20} color="#EF4444" />
                <Text style={styles.contactText}>{dealer.website}</Text>
              </TouchableOpacity>
            )}
          </View>
          {renderSocialMedia()}
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Car size={24} color="#EF4444" />
              <Text style={styles.statValue}>{dealer.total_car}</Text>
              <Text style={styles.statLabel}>Total Cars Listed</Text>
            </View>
            <View style={styles.statItem}>
              <Star size={24} color="#F59E0B" />
              <Text style={styles.statValue}>
                {dealer.total_dealer_rating && dealer.total_dealer_rating > 0 
                  ? dealer.total_dealer_rating.toFixed(1) 
                  : 'N/A'}
              </Text>
              <Text style={styles.statLabel}>
                {dealer.total_dealer_rating && dealer.total_dealer_rating > 0 
                  ? 'Average Rating' 
                  : 'No Ratings Yet'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Shield size={24} color="#059669" />
              <Text style={styles.statValue}>
                {dealer.kyc_status === 'enable' ? 'Verified' : 'Pending'}
              </Text>
              <Text style={styles.statLabel}>Verification Status</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        {dealer.about_me && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>{dealer.about_me}</Text>
          </View>
        )}

        {/* Operating Hours */}
        {renderOperatingHours()}

        {/* Car Listings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Car Listings ({cars.total} {cars.total === 1 ? 'car' : 'cars'})
          </Text>
          
          {cars.data.length > 0 ? (
            <>
              <View style={styles.carsContainer}>
                {cars.data.map((car) => (
                  <VehicleCard
                    key={car.id}
                    vehicle={transformDealerCarToVehicle(car)}
                    onPress={() => handleCarPress(car.id)}
                  />
                ))}
              </View>
              
              {/* Load More Button */}
              {cars.next_page_url && (
                <TouchableOpacity 
                  style={styles.loadMoreButton} 
                  onPress={loadMoreCars}
                  disabled={loadingCars}
                >
                  {loadingCars ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.loadMoreText}>Load More Cars</Text>
                  )}
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Car size={48} color="#525353" />
              <Text style={styles.emptyTitle}>No Cars Listed</Text>
              <Text style={styles.emptySubtitle}>This dealer has no cars listed at the moment.</Text>
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  scrollView: {
    flex: 1,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  backButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dealerHeader: {
    backgroundColor: theme.colors.surface,
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dealerImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  dealerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.inputBackground,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.surface,
  },
  dealerInfo: {
    alignItems: 'center',
  },
  dealerName: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    color: theme.colors.textTertiary,
    marginLeft: 4,
  },
  designation: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  section: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  contactGrid: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 12,
    gap: 12,
  },
  contactText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  socialMediaContainer: {
    marginTop: 16,
  },
  socialMediaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  socialMediaButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
  aboutText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  hoursContainer: {
    gap: 8,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 8,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  hourText: {
    fontSize: 14,
    color: theme.colors.textTertiary,
  },
  carsContainer: {
    gap: 0,
  },
  loadMoreButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
  },
  loadMoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
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
  bottomSpacing: {
    height: 32,
  },
});