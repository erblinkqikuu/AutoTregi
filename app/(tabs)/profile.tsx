import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
  FlatList,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import {
  User,
  Settings,
  Globe,
  Car,
  MessageCircle,
  Star,
  Shield,
  LogOut,
  ChevronRight,
  Eye,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  X,
  Edit3,
  Trash2,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useTranslation } from '@/contexts/TranslationContext';
import { useAppContext } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Language } from '@/types';

interface DashboardUser {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  address?: string;
  image?: string;
  email_verified_at?: string;
  total_car?: number;
  created_at?: string;
  is_dealer?: number;
  kyc_status?: string;
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

interface CarListing {
  id: number;
  title: string;
  thumb_image: string;
  regular_price: string;
  offer_price: string;
  year: string;
  mileage: string;
  fuel_type: string;
  transmission: string;
  condition: string;
  total_view: number;
  created_at: string;
  brand: {
    name: string;
  };
}

interface DashboardData {
  user: DashboardUser;
  cars: CarListing[];
  total_car: number;
  total_featured_car: number;
  total_wishlist_count: number;
}

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { state, logout, setLanguage } = useAppContext();
  const { theme } = useTheme();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCarsModal, setShowCarsModal] = useState(false);
  const [deletingCarId, setDeletingCarId] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProfileData, setEditProfileData] = useState<any>(null);
  const [loadingEditProfile, setLoadingEditProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const languages = [
    { code: 'sq' as Language, name: 'Shqip', flag: '🇦🇱' },
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' },
  ];

  useEffect(() => {
    if (state.isAuthenticated && state.user?.id) {
      fetchDashboardData();
    }
  }, [state.isAuthenticated]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Get auth token from localStorage
      const accessToken = Platform.OS === 'web' ? localStorage.getItem('access_token') : null;
      
      if (!accessToken) {
        console.error('No access token found');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/user/dashboard?user_id=${state.user?.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      // Get auth token from localStorage
      const accessToken2 = Platform.OS === 'web' ? localStorage.getItem('access_token') : null;
      
      if (!accessToken2) {
        console.error('No access token found');
        return;
      }
      
      const response2 = await fetch('http://localhost:8000/api/user/edit-profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken2}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        console.error('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEditProfileData = async () => {
    setLoadingEditProfile(true);
    try {
      const accessToken = Platform.OS === 'web' ? localStorage.getItem('access_token') : null;
      
      if (!accessToken) {
        console.error('No access token found');
        return;
      }

      const response = await fetch('http://localhost:8000/api/user/edit-profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setEditProfileData(data.user);
      } else {
        console.error('Failed to fetch edit profile data');
      }
    } catch (error) {
      console.error('Error fetching edit profile data:', error);
    } finally {
      setLoadingEditProfile(false);
    }
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
    fetchEditProfileData();
  };

  const handleSaveProfile = async () => {
    if (!editProfileData) return;

    setSavingProfile(true);
    try {
      const accessToken = Platform.OS === 'web' ? localStorage.getItem('access_token') : null;
      
      if (!accessToken) {
        console.error('No access token found');
        return;
      }

      const response = await fetch('http://localhost:8000/api/user/update-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editProfileData),
      });
      
      if (response.ok) {
        setShowEditModal(false);
        fetchDashboardData(); // Refresh dashboard data
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handleLogout = () => {
    logout();
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleRegister = () => {
    router.push('/auth/register');
  };

  const formatPrice = (price: string) => {
    if (!price) return '0';
    const numPrice = parseInt(price.toString());
    return isNaN(numPrice) ? '0' : new Intl.NumberFormat('en-US').format(numPrice);
  };

  const getWorkingHours = (user: DashboardUser) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const workingDays = days.filter(day => user[day as keyof DashboardUser] && user[day as keyof DashboardUser] !== null);
    return workingDays.length > 0 ? `${workingDays.length} days/week` : 'Not specified';
  };

  const handleDeleteCar = async (carId: number) => {
    setDeletingCarId(carId);
    try {
      // Add your delete API call here
      console.log('Deleting car:', carId);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh dashboard data after deletion
      await fetchDashboardData();
    } catch (error) {
      console.error('Error deleting car:', error);
    } finally {
      setDeletingCarId(null);
    }
  };

  const handleEditCar = (carId: number) => {
    console.log('Editing car:', carId);
    // Add your edit functionality here
  };

  const renderCarItem = ({ item }: { item: CarListing }) => (
    <TouchableOpacity style={styles.carCard} activeOpacity={0.7}>
      <Image
        source={{ uri: item.thumb_image ? `https://autotregi.com/${item.thumb_image}` : 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg' }}
        style={styles.carImage}
        resizeMode="cover"
      />
      <View style={styles.carInfo}>
        <Text style={styles.carTitle} numberOfLines={1}>{item.title || 'No Title'}</Text>
        <Text style={styles.carBrand}>{item.brand?.name || 'Unknown Brand'}</Text>
        <View style={styles.carDetails}>
          <Text style={styles.carDetailText}>{item.year || 'N/A'}</Text>
          <Text style={styles.carDetailText}>•</Text>
          <Text style={styles.carDetailText}>{item.mileage || 'N/A'}</Text>
          <Text style={styles.carDetailText}>•</Text>
          <Text style={styles.carDetailText}>{item.fuel_type || 'N/A'}</Text>
        </View>
        <View style={styles.carPriceRow}>
          <View style={styles.priceContainer}>
            {item.offer_price && item.regular_price && item.offer_price !== item.regular_price && (
              <Text style={styles.originalPrice}>€{formatPrice(item.regular_price || '0')}</Text>
            )}
            <Text style={styles.currentPrice}>€{formatPrice(item.offer_price || item.regular_price || '0')}</Text>
          </View>
          <View style={styles.viewsContainer}>
            <Eye size={14} color={theme.colors.textTertiary} />
            <Text style={styles.viewsText}>{item.total_view || 0}</Text>
          </View>
        </View>
        <View style={styles.carStatus}>
          <View style={[styles.statusBadge, { backgroundColor: item.condition === 'New' ? '#10B981' : item.condition === 'Used' ? '#F59E0B' : '#EF4444' }]}>
            <Text style={styles.statusText}>{item.condition || 'Unknown'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCarManagementItem = ({ item }: { item: CarListing }) => (
    <View style={styles.carManagementItem}>
      <Image
        source={{ uri: item.thumb_image ? `https://autotregi.com/${item.thumb_image}` : 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg' }}
        style={styles.carManagementImage}
        resizeMode="cover"
      />
      <View style={styles.carManagementInfo}>
        <Text style={styles.carManagementCarTitle} numberOfLines={1}>{item.title || 'No Title'}</Text>
        <Text style={styles.carManagementCarBrand}>{item.brand?.name || 'Unknown Brand'}</Text>
        <View style={styles.carManagementDetails}>
          <Text style={styles.carManagementDetailText}>{item.year || 'N/A'}</Text>
          <Text style={styles.carManagementDetailText}>•</Text>
          <Text style={styles.carManagementDetailText}>{item.condition || 'Unknown'}</Text>
          <Text style={styles.carManagementDetailText}>•</Text>
          <Text style={styles.carManagementDetailText}>€{formatPrice(item.offer_price || item.regular_price || '0')}</Text>
        </View>
        <View style={styles.carManagementStats}>
          <View style={styles.carManagementStat}>
            <Eye size={12} color={theme.colors.textTertiary} />
            <Text style={styles.carManagementStatText}>{item.total_view || 0}</Text>
          </View>
          <View style={[styles.carManagementStatusBadge, { backgroundColor: item.condition === 'New' ? '#10B981' : item.condition === 'Used' ? '#F59E0B' : '#EF4444' }]}>
            <Text style={styles.carManagementStatusText}>{item.condition || 'Unknown'}</Text>
          </View>
        </View>
      </View>
      <View style={styles.carManagementActions}>
        <TouchableOpacity
          style={styles.carManagementEditButton}
          onPress={() => handleEditCar(item.id)}
          activeOpacity={0.7}
        >
          <Edit3 size={14} color="#3B82F6" />
          <Text style={styles.carManagementEditText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.carManagementDeleteButton,
            deletingCarId === item.id && styles.carManagementDeleteButtonDisabled
          ]}
          onPress={() => handleDeleteCar(item.id)}
          disabled={deletingCarId === item.id}
          activeOpacity={0.7}
        >
          <Trash2 size={14} color="#EF4444" />
          <Text style={styles.carManagementDeleteText}>
            {deletingCarId === item.id ? 'Deleting...' : 'Delete'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const menuItems = [
    {
      icon: Star,
      title: 'Featured Cars',
      subtitle: `${dashboardData?.total_featured_car || 0} featured listings`,
      onPress: () => console.log('Featured Cars'),
    },
    {
      icon: MessageCircle,
      title: 'Wishlist',
      subtitle: `${dashboardData?.total_wishlist_count || 0} saved cars`,
      onPress: () => console.log('Wishlist'),
    },
    {
      icon: Settings,
      title: 'Settings',
      subtitle: 'App preferences and privacy',
      onPress: () => console.log('Settings'),
    },
  ];

  const styles = createStyles(theme);

  if (state.isLoading || loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Image
              source={{ uri: 'https://autotregi.com/uploads/website-images/logo2-2025-06-17-11-06-05-8205.png' }}
              style={styles.logoSymbol}
              resizeMode="contain"
            />
            <Text style={styles.title}>{t('profile')}</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.title}>{t('profile')}</Text>
          </View>
        </View>
        
        <View style={styles.authSection}>
          <User size={64} color={theme.colors.textTertiary} />
          <Text style={styles.authTitle}>Welcome to Autotregi</Text>
          <Text style={styles.authSubtitle}>
            Login or register to access your profile and manage your listings
          </Text>
          
          <View style={styles.authButtons}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>{t('login')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>{t('register')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Language Selection for Unauthenticated Users */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Globe size={16} color={theme.colors.textTertiary} />
            <Text style={styles.sectionTitleText}>Language</Text>
          </View>
          <View style={styles.languageGrid}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  state.language === lang.code && styles.languageOptionActive,
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text
                  style={[
                    styles.languageText,
                    state.language === lang.code && styles.languageTextActive,
                  ]}
                >
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const user = dashboardData?.user || state.user;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image
            source={{ uri: 'https://autotregi.com/uploads/website-images/logo2-2025-06-17-11-06-05-8205.png' }}
            style={styles.logoSymbol}
            resizeMode="contain"
          />
          <Text style={styles.title}>Dashboard</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{ 
              uri: user?.image 
                ? `https://autotregi.com/${user.image}`
                : 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
            }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>
            {user?.name || 'User'}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          
          {user?.email_verified_at && (
            <View style={styles.verifiedBadge}>
              <Shield size={16} color="#059669" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}

          {user?.is_dealer === 1 && (
            <View style={styles.dealerBadge}>
              <Car size={16} color="#3B82F6" />
              <Text style={styles.dealerText}>Dealer</Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={handleEditProfile}
            activeOpacity={0.7}
          >
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* User Details Section */}
        {dashboardData?.user && (
          <View style={styles.detailsSection}>
            {user?.phone && (
              <View style={styles.detailRow}>
                <Phone size={16} color={theme.colors.textTertiary} />
                <Text style={styles.detailText}>{user.phone}</Text>
              </View>
            )}
            
            {user?.address && (
              <View style={styles.detailRow}>
                <MapPin size={16} color={theme.colors.textTertiary} />
                <Text style={styles.detailText}>{user.address}</Text>
              </View>
            )}
            
            {user?.email && (
              <View style={styles.detailRow}>
                <Mail size={16} color={theme.colors.textTertiary} />
                <Text style={styles.detailText}>{user.email}</Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Clock size={16} color={theme.colors.textTertiary} />
              <Text style={styles.detailText}>Working: {getWorkingHours(user)}</Text>
            </View>
          </View>
        )}

        {/* Stats Section */}

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{dashboardData?.total_car || 0}</Text>
            <Text style={styles.statLabel}>Active Listings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{dashboardData?.total_featured_car || 0}</Text>
            <Text style={styles.statLabel}>Featured</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{dashboardData?.total_wishlist_count || 0}</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowCarsModal(true)}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <Car size={20} color={theme.colors.textTertiary} />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>My Cars</Text>
                <Text style={styles.menuItemSubtitle}>{dashboardData?.total_car || 0} total cars</Text>
              </View>
            </View>
            <ChevronRight size={20} color={theme.colors.textTertiary} />
          </TouchableOpacity>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIcon}>
                  <item.icon size={20} color={theme.colors.textTertiary} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Language Selection */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Globe size={16} color={theme.colors.textTertiary} />
            <Text style={styles.sectionTitleText}>Language</Text>
          </View>
          <View style={styles.languageGrid}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  state.language === lang.code && styles.languageOptionActive,
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text
                  style={[
                    styles.languageText,
                    state.language === lang.code && styles.languageTextActive,
                  ]}
                >
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutButtonText}>{t('logout')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Cars Management Modal */}
      <Modal
        visible={showCarsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCarsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <Car size={24} color={theme.colors.primary} />
              <Text style={styles.modalTitle}>My Cars</Text>
              <View style={styles.modalBadge}>
                <Text style={styles.modalBadgeText}>{dashboardData?.total_car || 0}</Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => setShowCarsModal(false)} 
              style={styles.modalCloseButton}
              activeOpacity={0.7}
            >
              <X size={24} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          </View>
          
          {dashboardData?.cars && dashboardData.cars.length > 0 ? (
            <FlatList
              data={dashboardData.cars}
              renderItem={renderCarManagementItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalContent}
            />
          ) : (
            <View style={styles.modalEmptyState}>
              <Car size={64} color={theme.colors.textTertiary} />
              <Text style={styles.modalEmptyTitle}>No Cars Listed</Text>
              <Text style={styles.modalEmptySubtitle}>
                You haven't listed any cars yet. Start by adding your first car listing.
              </Text>
            </View>
          )}
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <User size={24} color={theme.colors.primary} />
              <Text style={styles.modalTitle}>Edit Profile</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setShowEditModal(false)} 
              style={styles.modalCloseButton}
              activeOpacity={0.7}
            >
              <X size={24} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          </View>
          
          {loadingEditProfile ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading profile data...</Text>
            </View>
          ) : editProfileData ? (
            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.editProfileContent}>
                {/* Basic Information */}
                <View style={styles.editSection}>
                  <Text style={styles.editSectionTitle}>Basic Information</Text>
                  
                  <View style={styles.editInputGroup}>
                    <Text style={styles.editInputLabel}>Name</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editProfileData.name || ''}
                      onChangeText={(text) => setEditProfileData(prev => ({ ...prev, name: text }))}
                      placeholder="Enter your name"
                      placeholderTextColor={theme.colors.textTertiary}
                    />
                  </View>

                  <View style={styles.editInputGroup}>
                    <Text style={styles.editInputLabel}>Phone</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editProfileData.phone || ''}
                      onChangeText={(text) => setEditProfileData(prev => ({ ...prev, phone: text }))}
                      placeholder="Enter your phone number"
                      placeholderTextColor={theme.colors.textTertiary}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.editInputGroup}>
                    <Text style={styles.editInputLabel}>Address</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editProfileData.address || ''}
                      onChangeText={(text) => setEditProfileData(prev => ({ ...prev, address: text }))}
                      placeholder="Enter your address"
                      placeholderTextColor={theme.colors.textTertiary}
                    />
                  </View>

                  <View style={styles.editInputGroup}>
                    <Text style={styles.editInputLabel}>Designation</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editProfileData.designation || ''}
                      onChangeText={(text) => setEditProfileData(prev => ({ ...prev, designation: text }))}
                      placeholder="Enter your designation"
                      placeholderTextColor={theme.colors.textTertiary}
                    />
                  </View>

                  <View style={styles.editInputGroup}>
                    <Text style={styles.editInputLabel}>About Me</Text>
                    <TextInput
                      style={[styles.editInput, styles.editTextArea]}
                      value={editProfileData.about_me || ''}
                      onChangeText={(text) => setEditProfileData(prev => ({ ...prev, about_me: text }))}
                      placeholder="Tell us about yourself"
                      placeholderTextColor={theme.colors.textTertiary}
                      multiline
                      numberOfLines={4}
                    />
                  </View>
                </View>

                {/* Working Hours */}
                <View style={styles.editSection}>
                  <Text style={styles.editSectionTitle}>Working Hours</Text>
                  
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                    <View key={day} style={styles.editInputGroup}>
                      <Text style={styles.editInputLabel}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
                      <TextInput
                        style={styles.editInput}
                        value={editProfileData[day] || ''}
                        onChangeText={(text) => setEditProfileData(prev => ({ ...prev, [day]: text }))}
                        placeholder="e.g., 08:00-18:00 or leave empty for closed"
                        placeholderTextColor={theme.colors.textTertiary}
                      />
                    </View>
                  ))}
                </View>

                {/* Social Media */}
                <View style={styles.editSection}>
                  <Text style={styles.editSectionTitle}>Social Media</Text>
                  
                  <View style={styles.editInputGroup}>
                    <Text style={styles.editInputLabel}>Facebook</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editProfileData.facebook || ''}
                      onChangeText={(text) => setEditProfileData(prev => ({ ...prev, facebook: text }))}
                      placeholder="Facebook URL"
                      placeholderTextColor={theme.colors.textTertiary}
                    />
                  </View>

                  <View style={styles.editInputGroup}>
                    <Text style={styles.editInputLabel}>Twitter</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editProfileData.twitter || ''}
                      onChangeText={(text) => setEditProfileData(prev => ({ ...prev, twitter: text }))}
                      placeholder="Twitter URL"
                      placeholderTextColor={theme.colors.textTertiary}
                    />
                  </View>

                  <View style={styles.editInputGroup}>
                    <Text style={styles.editInputLabel}>Instagram</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editProfileData.instagram || ''}
                      onChangeText={(text) => setEditProfileData(prev => ({ ...prev, instagram: text }))}
                      placeholder="Instagram URL"
                      placeholderTextColor={theme.colors.textTertiary}
                    />
                  </View>

                  <View style={styles.editInputGroup}>
                    <Text style={styles.editInputLabel}>LinkedIn</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editProfileData.linkedin || ''}
                      onChangeText={(text) => setEditProfileData(prev => ({ ...prev, linkedin: text }))}
                      placeholder="LinkedIn URL"
                      placeholderTextColor={theme.colors.textTertiary}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          ) : (
            <View style={styles.modalEmptyState}>
              <Text style={styles.modalEmptyTitle}>Failed to load profile data</Text>
            </View>
          )}

          {/* Save Button */}
          {editProfileData && (
            <View style={styles.editProfileActions}>
              <TouchableOpacity
                style={[styles.editProfileSaveButton, savingProfile && styles.editProfileSaveButtonDisabled]}
                onPress={handleSaveProfile}
                disabled={savingProfile}
                activeOpacity={0.7}
              >
                <Text style={styles.editProfileSaveButtonText}>
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textTertiary,
  },
  scrollView: {
    flex: 1,
  },
  authSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  authButtons: {
    width: '100%',
    gap: 12,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  registerButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  profileSection: {
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.inputBackground,
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    marginBottom: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  dealerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    gap: 4,
  },
  dealerText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  editProfileButton: {
    backgroundColor: theme.colors.inputBackground,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editProfileButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  detailsSection: {
    backgroundColor: theme.colors.surface,
    marginBottom: 16,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    marginBottom: 16,
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  section: {
    backgroundColor: theme.colors.surface,
    marginBottom: 16,
    paddingVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  carCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.inputBackground,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  carImage: {
    width: 120,
    height: 100,
    backgroundColor: theme.colors.border,
  },
  carInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  carTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  carBrand: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    marginBottom: 4,
  },
  carDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  carDetailText: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  carPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  carStatus: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  languageGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  languageOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.inputBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
  },
  languageOptionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  languageFlag: {
    fontSize: 16,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textTertiary,
  },
  languageTextActive: {
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
  },
  yourCarsButton: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  yourCarsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yourCarsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  yourCarsText: {
    marginLeft: 16,
    flex: 1,
  },
  yourCarsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  yourCarsSubtitle: {
    fontSize: 14,
    color: theme.colors.textTertiary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  modalBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  modalBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalScrollView: {
    flex: 1,
  },
  modalContent: {
    padding: 16,
  },
  modalEmptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalEmptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  modalEmptySubtitle: {
    fontSize: 16,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    lineHeight: 24,
  },
  carManagementSection: {
    backgroundColor: theme.colors.inputBackground,
    marginTop: 1,
    paddingVertical: 16,
  },
  carManagementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  carManagementItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  carManagementImage: {
    width: 100,
    height: '100%',
    backgroundColor: theme.colors.border,
  },
  carManagementInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  carManagementCarTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  carManagementCarBrand: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    marginBottom: 4,
  },
  carManagementDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  carManagementDetailText: {
    fontSize: 11,
    color: theme.colors.textTertiary,
  },
  carManagementStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carManagementStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  carManagementStatText: {
    fontSize: 11,
    color: theme.colors.textTertiary,
  },
  carManagementStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  carManagementStatusText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  carManagementActions: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 8,
  },
  carManagementEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  carManagementEditText: {},
  editSection: {
    marginBottom: 24,
  },
  editSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  editInputGroup: {
    marginBottom: 16,
  },
  editInputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  editInput: {
    backgroundColor: theme.colors.inputBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.text,
  },
  editTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  editProfileActions: {
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  editProfileSaveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  editProfileSaveButtonDisabled: {
    opacity: 0.6,
  },
  editProfileSaveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }
}
);