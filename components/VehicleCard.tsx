import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, MapPin, Calendar, Gauge } from 'lucide-react-native';
import { Vehicle } from '@/types';
import { useTranslation } from '@/contexts/TranslationContext';
import { useAppContext } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onPress }) => {
  const { t } = useTranslation();
  const { addToFavorites, removeFromFavorites, isWishlisted, wishlistLoading } = useAppContext();
  const { theme } = useTheme();
  const [imageError, setImageError] = useState(false);

  const isFavorited = isWishlisted(vehicle.id);

  const handleFavoritePress = () => {
    if (wishlistLoading) return;
    
    try {
      if (isFavorited) {
        removeFromFavorites(vehicle.id);
      } else {
        addToFavorites(vehicle.id);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSource = () => {
    if (imageError || !vehicle.images || vehicle.images.length === 0 || !vehicle.images[0]) {
      // Fallback to a neutral placeholder
      return { uri: 'https://placehold.co/400x200/2a2b2b/525353?text=Loading...' };
    }
    return { uri: vehicle.images[0] };
  };

  const styles = createStyles(theme);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image 
          source={getImageSource()}
          style={styles.image}
          onError={handleImageError}
          resizeMode="cover"
          defaultSource={{ uri: 'https://placehold.co/400x200/2a2b2b/525353?text=Loading...' }}
        />
        {vehicle.isPromoted && (
          <View style={styles.promotedBadge}>
            <Text style={styles.promotedText}>PREMIUM</Text>
          </View>
        )}
        <TouchableOpacity 
          style={[styles.favoriteButton, wishlistLoading && styles.favoriteButtonDisabled]} 
          onPress={handleFavoritePress}
          disabled={wishlistLoading}
        >
          <Heart
            size={20}
            color={isFavorited ? '#EF4444' : (wishlistLoading ? '#9CA3AF' : theme.colors.textTertiary)}
            fill={isFavorited ? '#EF4444' : 'transparent'}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {vehicle.title}
        </Text>
        
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Calendar size={14} color={theme.colors.textTertiary} />
            <Text style={styles.detailText}>{vehicle.year}</Text>
          </View>
          <View style={styles.detailRow}>
            <Gauge size={14} color={theme.colors.textTertiary} />
            <Text style={styles.detailText}>{vehicle.mileage.toLocaleString()} km</Text>
          </View>
        </View>
        
        <View style={styles.locationRow}>
          <MapPin size={14} color={theme.colors.textTertiary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {vehicle.location}
          </Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {formatPrice(vehicle.price)}
          </Text>
          <Text style={styles.condition}>
            {t(vehicle.condition)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: theme.isDark ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.inputBackground,
  },
  promotedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#EA580C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  promotedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: theme.colors.surface,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: theme.isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteButtonDisabled: {
    opacity: 0.6,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  details: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  condition: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
});