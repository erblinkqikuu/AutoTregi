import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Linking,
  Platform,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { ArrowLeft, Heart, Share2, Phone, MessageCircle, MapPin, Calendar, Gauge, Fuel, Settings, Eye, Shield, Star, ChevronLeft, ChevronRight, X, Play, Mail, Calculator, User, Car, Palette, Users, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from '@/contexts/TranslationContext';
import { useWishlist } from '@/hooks/useWishlist';

const { width, height } = Dimensions.get('window');

interface CarDetail {
  id: string;
  title: string;
  brand: { name: string };
  year: string;
  offer_price: string;
  mileage: string;
  transmission: string;
  condition: string;
  fuel_type?: string;
  body_type?: string;
  engine_size?: string;
  color?: string;
  owners?: string;
  location?: string;
  address?: string;
  description?: string;
  features?: string[];
  images?: string[];
  video_url?: string;
  views?: number;
  agent_id?: number;
  seller?: {
    id: string;
    name: string;
    type: string;
    phone?: string;
    email?: string;
    total_cars?: number;
    joined_date?: string;
    image?: string;
  };
  created_at: string;
}

interface Dealer {
  id: number;
  name: string;
  username: string;
  designation?: string;
  image?: string;
  status: string;
  is_banned: string;
  is_dealer: number;
  address?: string;
  email: string;
  phone?: string;
  kyc_status: string;
  total_car: number;
}

interface DealersResponse {
  dealers: {
    current_page: number;
    data: Dealer[];
  };
}

interface ReviewData {
  name: string;
  email: string;
  rating: number;
  message: string;
}

interface ContactData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface LoanData {
  amount: number;
  rate: number;
  term: number;
}

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
<<<<<<< HEAD
  const { state, addToFavorites, removeFromFavorites, isWishlisted } = useAppContext();
=======
  const { addToFavorites, removeFromFavorites, wishlistLoading } = useAppContext();
  const { isWishlisted } = useWishlist();
>>>>>>> ab07ba9c9a08229c2ea95638cd28ee76a13a2908
  
  const [carDetail, setCarDetail] = useState<CarDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactData, setContactData] = useState<ContactData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [reviewData, setReviewData] = useState<ReviewData>({
    name: '',
    email: '',
    rating: 5,
    message: '',
  });
  const [loanData, setLoanData] = useState<LoanData>({
    amount: 0,
    rate: 5.5,
    term: 60,
  });
  const [relatedCars, setRelatedCars] = useState<CarDetail[]>([]);
  const [dealerInfo, setDealerInfo] = useState<Dealer | null>(null);
  const [loadingDealer, setLoadingDealer] = useState(false);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);

  // Gallery images state
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCarDetail();
      fetchRelatedCars();
      fetchCarGallery();
    }
  }, [id]);

  useEffect(() => {
    if (carDetail?.agent_id) {
      fetchDealerInfo(carDetail.agent_id);
    }
  }, [carDetail?.agent_id]);

  useEffect(() => {
    if (carDetail) {
      setLoanData(prev => ({
        ...prev,
        amount: parseFloat(carDetail.offer_price?.replace(/[,\s]/g, '') || '0'),
      }));
    }
  }, [carDetail]);

  const fetchCarDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://127.0.0.1:8000/api/listing/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.car) {
        setCarDetail(data.car);
      } else {
        throw new Error('Car not found');
      }
    } catch (err) {
      console.error('Error fetching car detail:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch car details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCarGallery = async () => {
    try {
      setLoadingGallery(true);
      
      const response = await fetch(`http://127.0.0.1:8000/api/user/car-gallery/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Handle different possible response structures
        let images: string[] = [];
        if (data.gallery && Array.isArray(data.gallery)) {
          images = data.gallery;
        } else if (data.images && Array.isArray(data.images)) {
          images = data.images;
        } else if (Array.isArray(data)) {
          images = data;
        }
        
        // Filter out any empty or invalid image URLs
        const validImages = images.filter(img => img && typeof img === 'string' && img.trim() !== '');
        setGalleryImages(validImages);
      }
    } catch (err) {
      console.error('Error fetching car gallery:', err);
      // Don't show error to user, just log it
    } finally {
      setLoadingGallery(false);
    }
  };

  const fetchDealerInfo = async (agentId: number) => {
    setLoadingDealer(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/dealers', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: DealersResponse = await response.json();
        const dealer = data.dealers.data.find(d => d.id === agentId);
        setDealerInfo(dealer || null);
      }
    } catch (error) {
      console.error('Error fetching dealer info:', error);
      setDealerInfo(null);
    } finally {
      setLoadingDealer(false);
    }
  };  

  const fetchRelatedCars = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/listings?page=1', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.cars?.data) {
          // Get first 4 cars as related (excluding current car)
          const related = data.cars.data
            .filter((car: CarDetail) => car.id !== id)
            .slice(0, 4);
          setRelatedCars(related);
        }
      }
    } catch (err) {
      console.error('Error fetching related cars:', err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EF4444" />
          <Text style={styles.loadingText}>Loading car details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !carDetail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Car not found'}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isFavorited = isWishlisted(carDetail.id);

<<<<<<< HEAD
  const handleFavoritePress = async () => {
    if (isUpdatingWishlist) return;
    
    setIsUpdatingWishlist(true);
    try {
      if (isFavorited) {
        await removeFromFavorites(carDetail.id);
      } else {
        await addToFavorites(carDetail.id);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      // Could show an alert here
    } finally {
      setIsUpdatingWishlist(false);
=======
  const handleFavoritePress = () => {
    if (wishlistLoading) return;
    
    try {
      if (isFavorited) {
        removeFromWishlist(carDetail.id);
      } else {
        addToWishlist(carDetail.id);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
>>>>>>> ab07ba9c9a08229c2ea95638cd28ee76a13a2908
    }
  };

  const handleShare = async () => {
    try {
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: carDetail.title,
            text: `Check out this ${carDetail.brand.name} ${carDetail.title} on Autotregi`,
            url: window.location.href,
          });
        } else {
          await navigator.clipboard.writeText(window.location.href);
          Alert.alert('Link copied', 'Car link copied to clipboard');
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCall = () => {
    const phone = dealerInfo?.phone || carDetail.seller?.phone;
    if (phone) {
      const phoneUrl = `tel:${phone}`;
      Linking.openURL(phoneUrl).catch(() => {
        Alert.alert('Error', 'Unable to make phone call');
      });
    }
  };

  const handleEmail = () => {
    const email = dealerInfo?.email || carDetail.seller?.email;
    if (email) {
      const emailUrl = `mailto:${email}`;
      Linking.openURL(emailUrl).catch(() => {
        Alert.alert('Error', 'Unable to open email');
      });
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price?.replace(/[,\s]/g, '') || '0');
    return numPrice.toLocaleString('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatMileage = (mileage: string) => {
    const numMileage = parseFloat(mileage?.replace(/[,\s]/g, '') || '0');
    return `${numMileage.toLocaleString('en-US')} km`;
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://placehold.co/400x200/2a2b2b/525353?text=Loading...';
    const cleanPath = imagePath.replace(/\\/g, '/');
    return cleanPath.startsWith('http') ? cleanPath : `https://autotregi.com/${cleanPath}`;
  };

  const calculateMonthlyPayment = () => {
    const { amount, rate, term } = loanData;
    const monthlyRate = rate / 100 / 12;
    const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                   (Math.pow(1 + monthlyRate, term) - 1);
    return isNaN(payment) ? 0 : payment;
  };

  const handleContactSubmit = async () => {
    if (!contactData.name || !contactData.email || !contactData.message) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      // Here you would typically send the contact form to your API
      Alert.alert('Success', 'Your message has been sent to the seller!');
      setContactData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewData.name || !reviewData.email || !reviewData.message) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      // Here you would typically send the review to your API
      Alert.alert('Success', 'Your review has been submitted!');
      setReviewData({ name: '', email: '', rating: 5, message: '' });
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    }
  };

  const renderStars = (rating: number, onPress?: (rating: number) => void) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => onPress?.(i)}
          disabled={!onPress}
        >
          <Star
            size={20}
            color={i <= rating ? '#F59E0B' : '#525353'}
            fill={i <= rating ? '#F59E0B' : 'transparent'}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const renderImageGallery = () => {
    // Combine main images with gallery images
    const mainImages = carDetail.images || [carDetail.thumb_image].filter(Boolean);
    const allImages = [...mainImages, ...galleryImages];
    
    // Remove duplicates by converting to Set and back to Array
    const uniqueImages = Array.from(new Set(allImages.filter(Boolean)));
    
    return (
      <View style={styles.imageGalleryContainer}>
        {/* Loading indicator for gallery */}
        {loadingGallery && (
          <View style={styles.galleryLoadingIndicator}>
            <ActivityIndicator size="small" color="#EF4444" />
            <Text style={styles.galleryLoadingText}>Loading gallery...</Text>
          </View>
        )}
        
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }}
          style={styles.mainImageScroll}
        >
          {uniqueImages.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setCurrentImageIndex(index);
                setShowFullGallery(true);
              }}
              style={styles.mainImageContainer}
            >
              <Image 
                source={{ uri: getImageUrl(image) }} 
                style={styles.mainImage}
                defaultSource={{ uri: 'https://placehold.co/400x200/2a2b2b/525353?text=Loading...' }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Image Counter */}
        <View style={styles.imageCounter}>
          <Text style={styles.imageCounterText}>
            {currentImageIndex + 1} / {uniqueImages.length}
          </Text>
        </View>

        {/* Thumbnail Strip */}
        {uniqueImages.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailScroll}
            contentContainerStyle={styles.thumbnailContainer}
          >
            {uniqueImages.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentImageIndex(index)}
                style={[
                  styles.thumbnail,
                  currentImageIndex === index && styles.thumbnailActive,
                ]}
              >
                <Image 
                  source={{ uri: getImageUrl(image) }} 
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

  // Get all images for full gallery view
  const allImagesForGallery = [...(carDetail.images || [carDetail.thumb_image].filter(Boolean)), ...galleryImages].filter((img, index, arr) => arr.indexOf(img) === index);

  const renderKeyInformation = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Key Information</Text>
      <View style={styles.keyInfoGrid}>
        <View style={styles.keyInfoItem}>
          <Car size={16} color="#A3A3A3" />
          <Text style={styles.keyInfoLabel}>Body Type</Text>
          <Text style={styles.keyInfoValue}>{carDetail.body_type || 'Sedan'}</Text>
        </View>
        <View style={styles.keyInfoItem}>
          <Settings size={16} color="#A3A3A3" />
          <Text style={styles.keyInfoLabel}>Engine Size</Text>
          <Text style={styles.keyInfoValue}>{carDetail.engine_size || '2.0L'}</Text>
        </View>
        <View style={styles.keyInfoItem}>
          <Gauge size={16} color="#A3A3A3" />
          <Text style={styles.keyInfoLabel}>Mileage</Text>
          <Text style={styles.keyInfoValue}>{formatMileage(carDetail.mileage)}</Text>
        </View>
        <View style={styles.keyInfoItem}>
          <Calendar size={16} color="#A3A3A3" />
          <Text style={styles.keyInfoLabel}>Year</Text>
          <Text style={styles.keyInfoValue}>{carDetail.year}</Text>
        </View>
        <View style={styles.keyInfoItem}>
          <CheckCircle size={16} color="#A3A3A3" />
          <Text style={styles.keyInfoLabel}>Condition</Text>
          <Text style={styles.keyInfoValue}>{carDetail.condition}</Text>
        </View>
        <View style={styles.keyInfoItem}>
          <Users size={16} color="#A3A3A3" />
          <Text style={styles.keyInfoLabel}>No. of Owners</Text>
          <Text style={styles.keyInfoValue}>{carDetail.owners || '1'}</Text>
        </View>
        <View style={styles.keyInfoItem}>
          <Palette size={16} color="#A3A3A3" />
          <Text style={styles.keyInfoLabel}>Color</Text>
          <Text style={styles.keyInfoValue}>{carDetail.color || 'Black'}</Text>
        </View>
        <View style={styles.keyInfoItem}>
          <Fuel size={16} color="#A3A3A3" />
          <Text style={styles.keyInfoLabel}>Fuel Type</Text>
          <Text style={styles.keyInfoValue}>{carDetail.fuel_type || 'Gasoline'}</Text>
        </View>
        <View style={styles.keyInfoItem}>
          <Settings size={16} color="#A3A3A3" />
          <Text style={styles.keyInfoLabel}>Transmission</Text>
          <Text style={styles.keyInfoValue}>{carDetail.transmission}</Text>
        </View>
        <View style={styles.keyInfoItem}>
          <User size={16} color="#A3A3A3" />
          <Text style={styles.keyInfoLabel}>Seller Type</Text>
          <Text style={styles.keyInfoValue}>{carDetail.seller?.type || 'Dealer'}</Text>
        </View>
        <View style={styles.keyInfoItem}>
          <MapPin size={16} color="#A3A3A3" />
          <Text style={styles.keyInfoLabel}>Address</Text>
          <Text style={styles.keyInfoValue}>{carDetail.address || carDetail.location || 'Tiranë'}</Text>
        </View>
        <View style={styles.keyInfoItem}>
          <Eye size={16} color="#A3A3A3" />
          <Text style={styles.keyInfoLabel}>Views</Text>
          <Text style={styles.keyInfoValue}>{carDetail.views || 0}</Text>
        </View>
      </View>
    </View>
  );

  const renderDescription = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Description Overview</Text>
      <Text style={styles.description}>
        {carDetail.description || `This ${carDetail.brand.name} ${carDetail.title} from ${carDetail.year} is in excellent condition with ${formatMileage(carDetail.mileage)} on the odometer. Perfect for those looking for a reliable and stylish vehicle.`}
      </Text>
    </View>
  );

  const renderFeatures = () => {
    const features = Array.isArray(carDetail.features) && carDetail.features.length > 0 
      ? carDetail.features 
      : [
      'Auxiliary Heating',
      'Head-Up Display',
      'Panoramic Roof',
      'Bluetooth',
      'Navigation System',
      'Leather Seats',
      'Climate Control',
      'Parking Sensors',
    ];

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <CheckCircle size={16} color="#059669" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderVideo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Video</Text>
      <TouchableOpacity style={styles.videoPlaceholder}>
        <Play size={48} color="#FFFFFF" />
        <Text style={styles.videoText}>Watch Video Tour</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLocation = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Location</Text>
      <TouchableOpacity style={styles.mapPlaceholder}>
        <MapPin size={32} color="#EF4444" />
        <Text style={styles.locationText}>{carDetail.address || carDetail.location || 'Tiranë, Albania'}</Text>
        <Text style={styles.openMapText}>Tap to open in maps</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContactSeller = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Contact Seller</Text>
      
      {/* Seller Info */}
      {loadingDealer ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EF4444" />
          <Text style={styles.loadingText}>Loading dealer info...</Text>
        </View>
      ) : (
        <View style={styles.sellerCard}>
          <View style={styles.sellerHeader}>
            <Image
              source={{ 
                uri: dealerInfo?.image 
                  ? getImageUrl(dealerInfo.image)
                  : carDetail.seller?.image 
                  ? getImageUrl(carDetail.seller.image)
                  : 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
              }}
              style={styles.sellerAvatar}
            />
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>
                {dealerInfo?.name || carDetail.seller?.name || 'AutoSalloni Alberti'}
              </Text>
              <Text style={styles.sellerType}>
                {dealerInfo?.is_dealer === 1 ? 'Dealer' : carDetail.seller?.type || 'Dealer'}
              </Text>
              <Text style={styles.sellerStats}>
                {dealerInfo?.total_car || carDetail.seller?.total_cars || 15} cars
                {dealerInfo?.address && ` • ${dealerInfo.address}`}
              </Text>
              {dealerInfo?.kyc_status === 'enable' && (
                <View style={styles.verifiedBadge}>
                  <Shield size={12} color="#059669" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
          </View>

          {/* Contact Buttons */}
          <View style={styles.contactButtons}>
            <TouchableOpacity 
              style={[
                styles.contactButton, 
                !(dealerInfo?.phone || carDetail.seller?.phone) && styles.contactButtonDisabled
              ]} 
              onPress={handleCall}
              disabled={!(dealerInfo?.phone || carDetail.seller?.phone)}
            >
              <Phone size={20} color="#FFFFFF" />
              <Text style={styles.contactButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.contactButton,
                !(dealerInfo?.email || carDetail.seller?.email) && styles.contactButtonDisabled
              ]} 
              onPress={handleEmail}
              disabled={!(dealerInfo?.email || carDetail.seller?.email)}
            >
              <Mail size={20} color="#FFFFFF" />
              <Text style={styles.contactButtonText}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Contact Form */}
      <View style={styles.contactForm}>
        <Text style={styles.formTitle}>Send Message</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Your Name"
          placeholderTextColor="#737373"
          value={contactData.name}
          onChangeText={(text) => setContactData(prev => ({ ...prev, name: text }))}
        />
        <TextInput
          style={styles.formInput}
          placeholder="Your Email"
          placeholderTextColor="#737373"
          value={contactData.email}
          onChangeText={(text) => setContactData(prev => ({ ...prev, email: text }))}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.formInput}
          placeholder="Phone Number"
          placeholderTextColor="#737373"
          value={contactData.phone}
          onChangeText={(text) => setContactData(prev => ({ ...prev, phone: text }))}
          keyboardType="phone-pad"
        />
        <TextInput
          style={[styles.formInput, styles.formTextArea]}
          placeholder="Your Message"
          placeholderTextColor="#737373"
          value={contactData.message}
          onChangeText={(text) => setContactData(prev => ({ ...prev, message: text }))}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleContactSubmit}>
          <Text style={styles.submitButtonText}>Send Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLoanCalculator = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Auto Loan Calculator</Text>
      <View style={styles.loanCalculator}>
        <View style={styles.loanInputGroup}>
          <Text style={styles.loanLabel}>Loan Amount</Text>
          <TextInput
            style={styles.loanInput}
            value={loanData.amount.toString()}
            onChangeText={(text) => setLoanData(prev => ({ ...prev, amount: parseFloat(text) || 0 }))}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#737373"
          />
        </View>
        <View style={styles.loanInputGroup}>
          <Text style={styles.loanLabel}>Interest Rate (%)</Text>
          <TextInput
            style={styles.loanInput}
            value={loanData.rate.toString()}
            onChangeText={(text) => setLoanData(prev => ({ ...prev, rate: parseFloat(text) || 0 }))}
            keyboardType="numeric"
            placeholder="5.5"
            placeholderTextColor="#737373"
          />
        </View>
        <View style={styles.loanInputGroup}>
          <Text style={styles.loanLabel}>Loan Term (months)</Text>
          <TextInput
            style={styles.loanInput}
            value={loanData.term.toString()}
            onChangeText={(text) => setLoanData(prev => ({ ...prev, term: parseInt(text) || 0 }))}
            keyboardType="numeric"
            placeholder="60"
            placeholderTextColor="#737373"
          />
        </View>
        <View style={styles.loanResult}>
          <Calculator size={24} color="#EF4444" />
          <Text style={styles.loanResultText}>
            Monthly Payment: {formatPrice(calculateMonthlyPayment().toString())}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderReviewSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Write Your Review</Text>
      <View style={styles.reviewForm}>
        <View style={styles.ratingSection}>
          <Text style={styles.ratingLabel}>Your Rating</Text>
          {renderStars(reviewData.rating, (rating) => 
            setReviewData(prev => ({ ...prev, rating }))
          )}
        </View>
        <TextInput
          style={styles.formInput}
          placeholder="Your Name"
          placeholderTextColor="#737373"
          value={reviewData.name}
          onChangeText={(text) => setReviewData(prev => ({ ...prev, name: text }))}
        />
        <TextInput
          style={styles.formInput}
          placeholder="Your Email"
          placeholderTextColor="#737373"
          value={reviewData.email}
          onChangeText={(text) => setReviewData(prev => ({ ...prev, email: text }))}
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.formInput, styles.formTextArea]}
          placeholder="Your Review"
          placeholderTextColor="#737373"
          value={reviewData.message}
          onChangeText={(text) => setReviewData(prev => ({ ...prev, message: text }))}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleReviewSubmit}>
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRelatedCars = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Related Car Listings</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.relatedCarsContainer}>
          {relatedCars.map((car) => (
            <TouchableOpacity
              key={car.id}
              style={styles.relatedCarCard}
              onPress={() => router.push(`/vehicle/${car.id}`)}
            >
              <Image
                source={{ uri: getImageUrl(car.thumb_image) }}
                style={styles.relatedCarImage}
                defaultSource={{ uri: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800' }}
              />
              <View style={styles.relatedCarInfo}>
                <Text style={styles.relatedCarTitle} numberOfLines={2}>
                  {car.title}
                </Text>
                <Text style={styles.relatedCarPrice}>
                  {formatPrice(car.offer_price)}
                </Text>
                <Text style={styles.relatedCarDetails}>
                  {car.year} • {formatMileage(car.mileage)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Share2 size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
<<<<<<< HEAD
            style={[styles.headerButton, isUpdatingWishlist && { opacity: 0.6 }]} 
            onPress={handleFavoritePress}
            disabled={isUpdatingWishlist}
          >
            <Heart
              size={20}
              color={isFavorited ? '#EF4444' : (isUpdatingWishlist ? '#9CA3AF' : '#FFFFFF')}
=======
            style={[styles.headerButton, wishlistLoading && { opacity: 0.6 }]} 
            onPress={handleFavoritePress}
            disabled={wishlistLoading}
          >
            <Heart
              size={20}
              color={isFavorited ? '#EF4444' : (wishlistLoading ? '#9CA3AF' : '#FFFFFF')}
>>>>>>> ab07ba9c9a08229c2ea95638cd28ee76a13a2908
              fill={isFavorited ? '#EF4444' : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        {renderImageGallery()}

        {/* Vehicle Info */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{carDetail.brand.name} {carDetail.title}</Text>
            <View style={styles.viewsContainer}>
              <Eye size={16} color="#A3A3A3" />
              <Text style={styles.viewsText}>{carDetail.views || 0}</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>
              {formatPrice(carDetail.offer_price)}
            </Text>
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>
                {carDetail.condition}
              </Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <MapPin size={16} color="#A3A3A3" />
            <Text style={styles.locationText}>{carDetail.address || carDetail.location || 'Tiranë, Albania'}</Text>
          </View>
        </View>

        {/* Key Information */}
        {renderKeyInformation()}

        {/* Description */}
        {renderDescription()}

        {/* Features */}
        {renderFeatures()}

        {/* Video */}
        {renderVideo()}

        {/* Location */}
        {renderLocation()}

        {/* Contact Seller */}
        {renderContactSeller()}

        {/* Loan Calculator */}
        {renderLoanCalculator()}

        {/* Review Section */}
        {renderReviewSection()}

        {/* Related Cars */}
        {renderRelatedCars()}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Full Screen Image Gallery */}
      {showFullGallery && (
        <View style={styles.fullGalleryOverlay}>
          <SafeAreaView style={styles.fullGalleryContainer}>
            <View style={styles.fullGalleryHeader}>
              <Text style={styles.fullGalleryCounter}>
                {currentImageIndex + 1} / {allImagesForGallery.length}
              </Text>
              <TouchableOpacity
                style={styles.fullGalleryClose}
                onPress={() => setShowFullGallery(false)}
              >
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setCurrentImageIndex(index);
              }}
              contentOffset={{ x: currentImageIndex * width, y: 0 }}
            >
              {allImagesForGallery.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: getImageUrl(image) }}
                  style={styles.fullGalleryImage}
                  resizeMode="contain"
                />
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  galleryLoadingIndicator: {
    position: 'absolute',
    top: 8,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 5,
  },
  galleryLoadingText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginLeft: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#1b1c1c',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    color: '#FFFFFF',
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
  errorText: {
    fontSize: 18,
    color: '#A3A3A3',
    marginBottom: 16,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  scrollView: {
    flex: 1,
  },
  imageGalleryContainer: {
    backgroundColor: '#2a2b2b',
    marginBottom: 8,
  },
  mainImageScroll: {
    height: 250,
  },
  mainImageContainer: {
    width: width,
    height: 250,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#404141',
  },
  imageCounter: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
    borderColor: '#EF4444',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#404141',
  },
  infoSection: {
    backgroundColor: '#2a2b2b',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#404141',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 28,
    marginRight: 12,
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EF4444',
  },
  conditionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#059669',
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: '#A3A3A3',
  },
  section: {
    backgroundColor: '#2a2b2b',
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  keyInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  keyInfoItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  keyInfoLabel: {
    flex: 1,
    fontSize: 12,
    color: '#A3A3A3',
  },
  keyInfoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 16,
    color: '#E5E5E5',
    lineHeight: 24,
  },
  featuresGrid: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  videoPlaceholder: {
    height: 200,
    backgroundColor: '#404141',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  videoText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: '#404141',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  openMapText: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  sellerCard: {
    backgroundColor: '#404141',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sellerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  sellerType: {
    fontSize: 12,
    color: '#EF4444',
    marginBottom: 2,
  },
  sellerStats: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  contactButtonDisabled: {
    backgroundColor: '#6B7280',
    opacity: 0.6,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: 'flex-start',
    gap: 4,
  },
  verifiedText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '500',
  },
  contactForm: {
    gap: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#404141',
    borderWidth: 1,
    borderColor: '#525353',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  formTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loanCalculator: {
    gap: 16,
  },
  loanInputGroup: {
    gap: 8,
  },
  loanLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E5E5E5',
  },
  loanInput: {
    backgroundColor: '#404141',
    borderWidth: 1,
    borderColor: '#525353',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  loanResult: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#404141',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  loanResultText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  reviewForm: {
    gap: 12,
  },
  ratingSection: {
    gap: 8,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E5E5E5',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  relatedCarsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  relatedCarCard: {
    width: 200,
    backgroundColor: '#404141',
    borderRadius: 12,
    overflow: 'hidden',
  },
  relatedCarImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#525353',
  },
  relatedCarInfo: {
    padding: 12,
  },
  relatedCarTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  relatedCarPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 4,
  },
  relatedCarDetails: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  bottomSpacing: {
    height: 20,
  },
  fullGalleryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    zIndex: 1000,
  },
  fullGalleryContainer: {
    flex: 1,
  },
  fullGalleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  fullGalleryCounter: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  fullGalleryClose: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullGalleryImage: {
    width: width,
    height: height - 100,
  },
}); 