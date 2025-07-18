import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Text } from 'react-native';

interface VehicleImageGalleryProps {
  images: string[];
  onImagePress: (index: number) => void;
  isPromoted?: boolean;
}

const { width } = Dimensions.get('window');
const imageHeight = 250;

export const VehicleImageGallery: React.FC<VehicleImageGalleryProps> = ({
  images,
  onImagePress,
  isPromoted = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.mainImageScroll}
      >
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onImagePress(index)}
            style={styles.mainImageContainer}
          >
            <Image 
              source={{ uri: image }} 
              style={styles.mainImage}
              defaultSource={{ uri: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Premium Badge */}
      {isPromoted && (
        <View style={styles.promotedBadge}>
          <Text style={styles.promotedText}>PREMIUM</Text>
        </View>
      )}

      {/* Image Counter */}
      <View style={styles.imageCounter}>
        <Text style={styles.imageCounterText}>
          {currentIndex + 1} / {images.length}
        </Text>
      </View>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailScroll}
          contentContainerStyle={styles.thumbnailContainer}
        >
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onImagePress(index)}
              style={[
                styles.thumbnail,
                currentIndex === index && styles.thumbnailActive,
              ]}
            >
              <Image 
                source={{ uri: image }} 
                style={styles.thumbnailImage}
                defaultSource={{ uri: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800' }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2b2b',
    marginBottom: 8,
  },
  mainImageScroll: {
    height: imageHeight,
  },
  mainImageContainer: {
    width: width,
    height: imageHeight,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#404141',
  },
  promotedBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#EA580C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 10,
  },
  promotedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  imageCounter: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 10,
  },
  imageCounterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  thumbnailScroll: {
    paddingVertical: 12,
  },
  thumbnailContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  thumbnail: {
    width: 60,
    height: 45,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: '#DC2626',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#404141',
  },
});