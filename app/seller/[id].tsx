import React, { useState } from 'react';
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
} from 'react-native';
import {
  ArrowLeft,
  Shield,
  Star,
  MapPin,
  Calendar,
  Phone,
  MessageCircle,
  Clock,
  Car,
  Eye,
  Heart,
  ChevronRight,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from '@/contexts/TranslationContext';
import { useAppContext } from '@/contexts/AppContext';
import { useApiVehicles } from '@/hooks/useApiVehicles';
import { useWishlist } from '@/hooks/useWishlist';
import { Vehicle, Review } from '@/types';

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: '1',
    reviewerId: '2',
    reviewerName: 'Silva Meta',
    reviewerAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    comment: 'Shitës shumë i mirë dhe i besueshëm. Makina ishte saktësisht siç e përshkroi.',
    vehicleTitle: 'BMW X5 2020',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    reviewerId: '3',
    reviewerName: 'Besnik Hoti',
    reviewerAvatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 4,
    comment: 'Komunikim i shpejtë dhe profesional. Rekomandoj!',
    vehicleTitle: 'Audi A4 2019',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    reviewerId: '4',
    reviewerName: 'Elena Marku',
    reviewerAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    comment: 'Excellent seller! Very honest and helpful throughout the process.',
    vehicleTitle: 'Mercedes C-Class 2018',
    createdAt: new Date('2024-01-10'),
  },
];

export default function SellerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { state, addToFavorites, removeFromFavorites } = useAppContext();
  const { isWishlisted } = useWishlist();
  const { vehicles: apiVehicles, loading } = useApiVehicles();
  
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews'>('listings');

  // Find the seller by ID
  const seller = apiVehicles.find(v => v.sellerId === id)?.seller;
  
  // Get seller's vehicles
  const sellerVehicles = apiVehicles.filter(v => v.sellerId === id);
  
  // Get seller's reviews
  const sellerReviews = mockReviews.filter(r => 
    sellerVehicles.some(v => v.title.includes(r.vehicleTitle.split(' ')[0]))
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading seller details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!seller) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t('sellerNotFound')}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>{t('back')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleCall = () => {
    if (seller.phone) {
      const phoneUrl = `tel:${seller.phone}`;
      Linking.openURL(phoneUrl).catch(() => {
        Alert.alert(t('error'), t('unableToCall'));
      });
    }
  };

  const handleMessage = () => {
    // Navigate to chat with seller
    Alert.alert(t('message'), t('messageFeatureComingSoon'));
  };

  const handleVehiclePress = (vehicleId: string) => {
    router.push(`/vehicle/${vehicleId}`);
  };

  const handleFavoritePress = (vehicleId: string) => {
    const isFavorited = isWishlisted(vehicleId);
    try {
      if (isFavorited) {
        removeFromFavorites(vehicleId);
      } else {
        addToFavorites(vehicleId);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={16} color="#F59E0B" fill="#F59E0B" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={16} color="#F59E0B" fill="#F59E0B" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={16} color="#525353" />
      );
    }

    return stars;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderVehicleItem = ({ item }: { item: Vehicle }) => {
    const isFavorited = isWishlisted(item.id);
    
    return (
      <TouchableOpacity 
        style={styles.vehicleCard} 
        onPress={() => handleVehiclePress(item.id)}
      >
        <View style={styles.vehicleImageContainer}>
          <Image source={{ uri: item.images[0] }} style={styles.vehicleImage} />
          {item.isPromoted && (
            <View style={styles.promotedBadge}>
              <Text style={styles.promotedText}>PREMIUM</Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={() => handleFavoritePress(item.id)}
          >
            <Heart
              size={16}
              color={isFavorited ? '#EF4444' : '#A3A3A3'}
              fill={isFavorited ? '#EF4444' : 'transparent'}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.vehicleContent}>
          <Text style={styles.vehicleTitle} numberOfLines={2}>
            {item.title}
          </Text>
          
          <View style={styles.vehicleDetails}>
            <Text style={styles.vehicleYear}>{item.year}</Text>
            <Text style={styles.vehicleMileage}>{item.mileage.toLocaleString()} km</Text>
          </View>
          
          <View style={styles.vehiclePriceRow}>
            <Text style={styles.vehiclePrice}>
              {item.price.toLocaleString('en-US')} {item.currency}
            </Text>
            <View style={styles.vehicleViews}>
              <Eye size={12} color="#A3A3A3" />
              <Text style={styles.vehicleViewsText}>{item.views}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
          <Image source={{ uri: item.reviewerAvatar }} style={styles.reviewerAvatar} />
          <View style={styles.reviewerDetails}>
            <Text style={styles.reviewerName}>{item.reviewerName}</Text>
            <Text style={styles.reviewDate}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>
        <View style={styles.reviewRating}>
          {renderStars(item.rating)}
        </View>
      </View>
      
      <Text style={styles.reviewComment}>{item.comment}</Text>
      
      <View style={styles.reviewVehicle}>
        <Car size={14} color="#A3A3A3" />
        <Text style={styles.reviewVehicleTitle}>{item.vehicleTitle}</Text>
      </View>
    </View>
  );

  const renderEmptyListings = () => (
    <View style={styles.emptyContainer}>
      <Car size={48} color="#525353" />
      <Text style={styles.emptyTitle}>{t('noActiveListings')}</Text>
      <Text style={styles.emptySubtitle}>{t('sellerHasNoListings')}</Text>
    </View>
  );

  const renderEmptyReviews = () => (
    <View style={styles.emptyContainer}>
      <Star size={48} color="#525353" />
      <Text style={styles.emptyTitle}>{t('noReviews')}</Text>
      <Text style={styles.emptySubtitle}>{t('sellerHasNoReviews')}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('sellerProfile')}</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Seller Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {seller.avatar ? (
              <Image source={{ uri: seller.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{seller.name.charAt(0)}</Text>
              </View>
            )}
            {seller.isVerified && (
              <View style={styles.verifiedBadge}>
                <Shield size={16} color="#059669" />
              </View>
            )}
          </View>
          
          <Text style={styles.sellerName}>{seller.name}</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {renderStars(seller.rating)}
            </View>
            <Text style={styles.ratingText}>
              {seller.rating.toFixed(1)} ({seller.reviewCount} {t('reviews')})
            </Text>
          </View>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#A3A3A3" />
            <Text style={styles.locationText}>{seller.location}</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Calendar size={20} color="#DC2626" />
            <Text style={styles.statLabel}>{t('memberSince')}</Text>
            <Text style={styles.statValue}>{seller.memberSince}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Clock size={20} color="#DC2626" />
            <Text style={styles.statLabel}>{t('responseTime')}</Text>
            <Text style={styles.statValue}>{seller.responseTime}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Car size={20} color="#DC2626" />
            <Text style={styles.statLabel}>{t('activeListings')}</Text>
            <Text style={styles.statValue}>{sellerVehicles.length}</Text>
          </View>
        </View>

        {/* Contact Actions */}
        <View style={styles.contactSection}>
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Phone size={20} color="#FFFFFF" />
            <Text style={styles.callButtonText}>{t('call')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
            <MessageCircle size={20} color="#FFFFFF" />
            <Text style={styles.messageButtonText}>{t('message')}</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'listings' && styles.activeTab]}
            onPress={() => setActiveTab('listings')}
          >
            <Text style={[styles.tabText, activeTab === 'listings' && styles.activeTabText]}>
              {t('listings')} ({sellerVehicles.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
              {t('reviews')} ({sellerReviews.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'listings' ? (
            <FlatList
              data={sellerVehicles}
              renderItem={renderVehicleItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={renderEmptyListings}
              numColumns={2}
              columnWrapperStyle={styles.vehicleRow}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <FlatList
              data={sellerReviews}
              renderItem={renderReviewItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={renderEmptyReviews}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

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
    paddingVertical: 12,
    backgroundColor: '#2a2b2b',
    borderBottomWidth: 1,
    borderBottomColor: '#525353',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#404141',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#2a2b2b',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#525353',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#A3A3A3',
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
    borderColor: '#2a2b2b',
  },
  sellerName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#A3A3A3',
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#A3A3A3',
    marginLeft: 4,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#2a2b2b',
    paddingVertical: 20,
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#525353',
  },
  statLabel: {
    fontSize: 12,
    color: '#A3A3A3',
    fontWeight: '500',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  contactSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#2a2b2b',
    marginBottom: 8,
    gap: 12,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#2a2b2b',
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#DC2626',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#A3A3A3',
  },
  activeTabText: {
    color: '#DC2626',
    fontWeight: '600',
  },
  tabContent: {
    backgroundColor: '#2a2b2b',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  vehicleRow: {
    justifyContent: 'space-between',
  },
  vehicleCard: {
    width: '48%',
    backgroundColor: '#363737',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  vehicleImageContainer: {
    position: 'relative',
  },
  vehicleImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#404141',
  },
  promotedBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EA580C',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  promotedText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#2a2b2b',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  vehicleContent: {
    padding: 12,
  },
  vehicleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 18,
  },
  vehicleDetails: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  vehicleYear: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  vehicleMileage: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  vehiclePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehiclePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  vehicleViews: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vehicleViewsText: {
    fontSize: 10,
    color: '#A3A3A3',
  },
  reviewCard: {
    backgroundColor: '#404141',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#525353',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    color: '#E5E5E5',
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewVehicle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reviewVehicleTitle: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#A3A3A3',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#A3A3A3',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 18,
    color: '#A3A3A3',
  },
});