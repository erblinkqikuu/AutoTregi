import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { Camera, Upload, MapPin } from 'lucide-react-native';
import { useTranslation } from '@/contexts/TranslationContext';
import { useAppContext } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { VehicleCategory, VehicleCondition, FuelType, TransmissionType } from '@/types';

export default function AddListingScreen() {
  const { t } = useTranslation();
  const { state } = useAppContext();
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'car' as VehicleCategory,
    make: '',
    model: '',
    year: '',
    price: '',
    condition: 'used' as VehicleCondition,
    mileage: '',
    fuelType: 'gasoline' as FuelType,
    transmission: 'manual' as TransmissionType,
    location: '',
    features: '',
  });

  const [photos, setPhotos] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPhoto = () => {
    // TODO: Implement photo picker
    Alert.alert('Photo', 'Camera/Gallery picker would open here');
  };

  const handleLocationPicker = () => {
    // TODO: Implement location picker
    Alert.alert('Location', 'Location picker would open here');
  };

  const handleSubmit = () => {
    if (!state.isAuthenticated) {
      Alert.alert(t('error'), 'Please login to add a listing');
      return;
    }

    // Validate required fields
    if (!formData.title || !formData.make || !formData.model || !formData.year || !formData.price) {
      Alert.alert(t('error'), 'Please fill in all required fields');
      return;
    }

    // TODO: Submit listing
    Alert.alert(t('success'), 'Listing would be submitted');
  };

  const categories = [
    { key: 'car', label: t('cars') },
    { key: 'motorcycle', label: t('motorcycles') },
    { key: 'truck', label: t('trucks') },
    { key: 'large-vehicle', label: t('largeVehicles') },
  ];

  const conditions = [
    { key: 'new', label: t('new') },
    { key: 'used', label: t('used') },
    { key: 'damaged', label: t('damaged') },
  ];

  const fuelTypes = [
    { key: 'gasoline', label: t('gasoline') },
    { key: 'diesel', label: t('diesel') },
    { key: 'electric', label: t('electric') },
    { key: 'hybrid', label: t('hybrid') },
    { key: 'lpg', label: t('lpg') },
    { key: 'cng', label: t('cng') },
  ];

  const transmissionTypes = [
    { key: 'manual', label: t('manual') },
    { key: 'automatic', label: t('automatic') },
    { key: 'cvt', label: t('cvt') },
  ];

  const renderPicker = (
    label: string,
    value: string,
    options: { key: string; label: string }[],
    onSelect: (value: string) => void
  ) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.pickerOption,
              { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.border },
              value === option.key && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
            ]}
            onPress={() => onSelect(option.key)}
          >
            <Text
              style={[
                styles.pickerOptionText,
                { color: theme.colors.textTertiary },
                value === option.key && { color: '#FFFFFF' },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
            <Text style={styles.title}>{t('addListing')}</Text>
          </View>
        </View>
        <View style={styles.authRequired}>
          <Text style={styles.authRequiredText}>
            Please login to add a vehicle listing
          </Text>
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
          <Text style={styles.title}>{t('addListing')}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Photos Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('photos')}</Text>
            <TouchableOpacity style={styles.photoButton} onPress={handleAddPhoto}>
              <Camera size={32} color={theme.colors.textTertiary} />
              <Text style={styles.photoButtonText}>Add Photos (0/10)</Text>
            </TouchableOpacity>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('title')} *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(value) => handleInputChange('title', value)}
                placeholder="e.g., BMW X5 2020 - Excellent condition"
                placeholderTextColor={theme.colors.inputPlaceholder}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('description')}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder="Describe your vehicle..."
                placeholderTextColor={theme.colors.inputPlaceholder}
                multiline
                numberOfLines={4}
              />
            </View>

            {renderPicker(
              'Category *',
              formData.category,
              categories,
              (value) => handleInputChange('category', value)
            )}
          </View>

          {/* Vehicle Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Details</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>{t('make')} *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.make}
                  onChangeText={(value) => handleInputChange('make', value)}
                  placeholder="BMW"
                  placeholderTextColor={theme.colors.inputPlaceholder}
                />
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>{t('model')} *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.model}
                  onChangeText={(value) => handleInputChange('model', value)}
                  placeholder="X5"
                  placeholderTextColor={theme.colors.inputPlaceholder}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>{t('year')} *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.year}
                  onChangeText={(value) => handleInputChange('year', value)}
                  placeholder="2020"
                  placeholderTextColor={theme.colors.inputPlaceholder}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>{t('price')} ({t('currency')}) *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.price}
                  onChangeText={(value) => handleInputChange('price', value)}
                  placeholder="45000"
                  placeholderTextColor={theme.colors.inputPlaceholder}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('mileage')} (km)</Text>
              <TextInput
                style={styles.input}
                value={formData.mileage}
                onChangeText={(value) => handleInputChange('mileage', value)}
                placeholder="35000"
                placeholderTextColor={theme.colors.inputPlaceholder}
                keyboardType="numeric"
              />
            </View>

            {renderPicker(
              t('condition'),
              formData.condition,
              conditions,
              (value) => handleInputChange('condition', value)
            )}

            {renderPicker(
              t('fuelType'),
              formData.fuelType,
              fuelTypes,
              (value) => handleInputChange('fuelType', value)
            )}

            {renderPicker(
              t('transmission'),
              formData.transmission,
              transmissionTypes,
              (value) => handleInputChange('transmission', value)
            )}
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('location')}</Text>
            <TouchableOpacity style={styles.locationButton} onPress={handleLocationPicker}>
              <MapPin size={20} color={theme.colors.textTertiary} />
              <Text style={styles.locationButtonText}>
                {formData.location || 'Select location'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('features')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.features}
              onChangeText={(value) => handleInputChange('features', value)}
              placeholder="Leather seats, Navigation system, Backup camera..."
              placeholderTextColor={theme.colors.inputPlaceholder}
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Publish Listing</Text>
          </TouchableOpacity>
        </View>
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
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.inputBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  pickerContainer: {
    flexDirection: 'row',
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  pickerOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  photoButton: {
    backgroundColor: theme.colors.inputBackground,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonText: {
    fontSize: 16,
    color: theme.colors.textTertiary,
    marginTop: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.inputBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  locationButtonText: {
    fontSize: 16,
    color: theme.colors.textTertiary,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
});