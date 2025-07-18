import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Star, Shield, User, MapPin, Calendar, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { Seller } from '@/types';

interface SellerCardProps {
  seller: Seller;
}

export function SellerCard({ seller }: SellerCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={14} color="#F59E0B" fill="#F59E0B" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={14} color="#F59E0B" fill="#F59E0B" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={14} color="#525353" />
      );
    }

    return stars;
  };

  const handleSellerPress = () => {
    router.push(`/seller/${seller.id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seller Information</Text>
      
      <TouchableOpacity style={styles.sellerCard} onPress={handleSellerPress}>
        <View style={styles.sellerHeader}>
          <View style={styles.avatarContainer}>
            {seller.avatar ? (
              <Image source={{ uri: seller.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={24} color="#A3A3A3" />
              </View>
            )}
          </View>
          
          <View style={styles.sellerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.sellerName}>{seller.name}</Text>
              {seller.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Shield size={14} color="#059669" />
                </View>
              )}
            </View>
            
            <View style={styles.ratingRow}>
              <View style={styles.stars}>
                {renderStars(seller.rating)}
              </View>
              <Text style={styles.ratingText}>
                {seller.rating.toFixed(1)} ({seller.reviewCount} reviews)
              </Text>
            </View>
            
            <View style={styles.locationRow}>
              <MapPin size={14} color="#A3A3A3" />
              <Text style={styles.locationText}>{seller.location}</Text>
            </View>
          </View>

          <ChevronRight size={20} color="#A3A3A3" />
        </View>
        
        <View style={styles.sellerStats}>
          <View style={styles.statItem}>
            <Calendar size={16} color="#A3A3A3" />
            <Text style={styles.statLabel}>Member since</Text>
            <Text style={styles.statValue}>{seller.memberSince}</Text>
          </View>
          
          {seller.responseTime && (
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Response time</Text>
              <Text style={styles.statValue}>{seller.responseTime}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2b2b',
    padding: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  sellerCard: {
    borderWidth: 1,
    borderColor: '#525353',
    borderRadius: 12,
    padding: 16,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#404141',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#A3A3A3',
    marginLeft: 4,
  },
  sellerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#404141',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});