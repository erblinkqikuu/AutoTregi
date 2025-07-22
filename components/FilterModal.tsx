import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { X, ChevronDown, ChevronUp, FileSliders as Sliders, ChevronRight } from 'lucide-react-native';
import { SearchFilters, VehicleCategory, VehicleCondition, FuelType, TransmissionType } from '@/types';
import { useTranslation } from '@/contexts/TranslationContext';
import { MakeModelSelector } from './MakeModelSelector';

interface Country {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
  country_id: number;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onApplyFilters: (filters: SearchFilters) => void;
  onResetFilters: () => void;
}

const { width } = Dimensions.get('window');

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    location: true,
    category: true,
    makeModel: true,
    price: true,
    year: false,
    condition: false,
    specs: false
  });
  const [showMakeModelSelector, setShowMakeModelSelector] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);


  const countries: Country[] = [
    { id: 4, name: 'Kosovo' },
    { id: 2, name: 'Albania' },
    { id: 5, name: 'North Macedonia' },
    { id: 6, name: 'Montenegro' },
  ];

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setShowMakeModelSelector(false);
    }
  }, [visible]);

  const fetchCities = async (countryId: number) => {
    setLoadingCities(true);
    try {
      console.log('Fetching cities for country ID:', countryId);
      const response = await fetch(`http://127.0.0.1:8000/api/cities-by-country/${countryId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Cities API response:', data);

      // Handle different possible response formats
      const citiesArray = Array.isArray(data) ? data : (data.cities || data.data || []);
      setCities(citiesArray);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setSelectedCity(null); // Reset city when country changes
    setCities([]); // Clear cities
    fetchCities(country.id);

    // Set country filter using ID
    updateFilter('countryId', country.id);
    updateFilter('cityId', undefined); // Clear city filter
    setShowCountryDropdown(false);
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    updateFilter('cityId', city.id);
    setShowCityDropdown(false);
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {};
    setLocalFilters(resetFilters);
    setSelectedCountry(null);
    setSelectedCity(null);
    setCities([]);
    onResetFilters();
  };

  const handleClose = () => {
    // Ensure make model selector is closed first
    if (showMakeModelSelector) {
      setShowMakeModelSelector(false);
      // Small delay to ensure proper cleanup
      setTimeout(() => {
        onClose();
      }, 150);
    } else {
      onClose();
    }
  };

  const handleMakeModelSelectorOpen = () => {
    console.log('Opening Make Model Selector');
    setShowMakeModelSelector(true);
  };

  const handleMakeModelSelectorClose = () => {
    console.log('Closing Make Model Selector');
    setShowMakeModelSelector(false);
  };

  const handleMakeSelect = (make: string) => {
    updateFilter('make', make);
    // Clear model when make changes
    if (localFilters.model) {
      updateFilter('model', undefined);
    }
  };

  const handleModelSelect = (model: string) => {
    updateFilter('model', model);
  };

  const categories: { key: VehicleCategory; label: string }[] = [
    { key: 'car', label: t('cars') },
    { key: 'motorcycle', label: t('motorcycles') },
    { key: 'truck', label: t('trucks') },
    { key: 'large-vehicle', label: t('largeVehicles') },
  ];

  const conditions: { key: VehicleCondition; label: string }[] = [
    { key: 'new', label: t('new') },
    { key: 'used', label: t('used') },
    { key: 'damaged', label: t('damaged') },
  ];

  const fuelTypes: { key: FuelType; label: string }[] = [
    { key: 'gasoline', label: t('gasoline') },
    { key: 'diesel', label: t('diesel') },
    { key: 'electric', label: t('electric') },
    { key: 'hybrid', label: t('hybrid') },
    { key: 'lpg', label: t('lpg') },
    { key: 'cng', label: t('cng') },
  ];

  const transmissionTypes: { key: TransmissionType; label: string }[] = [
    { key: 'manual', label: t('manual') },
    { key: 'automatic', label: t('automatic') },
    { key: 'cvt', label: t('cvt') },
  ];

  const renderSection = (
    title: string,
    sectionKey: string,
    content: React.ReactNode
  ) => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection(sectionKey)}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        {expandedSections[sectionKey] ? (
          <ChevronUp size={20} color="#6B7280" />
        ) : (
          <ChevronDown size={20} color="#6B7280" />
        )}
      </TouchableOpacity>
      {expandedSections[sectionKey] && (
        <View style={styles.sectionContent}>{content}</View>
      )}
    </View>
  );

  const renderMultiSelect = (
    options: { key: string; label: string }[],
    selectedValue: string | undefined,
    onSelect: (value: string | undefined) => void
  ) => (
    <View style={styles.multiSelectContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={[
            styles.multiSelectOption,
            selectedValue === option.key && styles.multiSelectOptionActive,
          ]}
          onPress={() => onSelect(selectedValue === option.key ? undefined : option.key)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.multiSelectOptionText,
              selectedValue === option.key && styles.multiSelectOptionTextActive,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderMakeModelSelector = () => (
    <View style={styles.makeModelContainer}>
      <TouchableOpacity
        style={styles.makeModelButton}
        onPress={handleMakeModelSelectorOpen}
        activeOpacity={0.7}
      >
        <View style={styles.makeModelContent}>
          <View style={styles.makeModelInfo}>
            <Text style={styles.makeModelLabel}>Make & Model</Text>
            <Text style={styles.makeModelValue}>
              {localFilters.make && localFilters.model
                ? `${localFilters.make} ${localFilters.model}`
                : localFilters.make
                  ? localFilters.make
                  : 'Select make and model'}
            </Text>
          </View>
          <ChevronRight size={20} color="#6B7280" />
        </View>
      </TouchableOpacity>

      {(localFilters.make || localFilters.model) && (
        <View style={styles.selectedMakeModel}>
          {localFilters.make && (
            <View style={styles.selectedItem}>
              <Text style={styles.selectedItemText}>{localFilters.make}</Text>
              <TouchableOpacity
                onPress={() => {
                  updateFilter('make', undefined);
                  updateFilter('model', undefined);
                }}
                activeOpacity={0.7}
              >
                <X size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}
          {localFilters.model && (
            <View style={styles.selectedItem}>
              <Text style={styles.selectedItemText}>{localFilters.model}</Text>
              <TouchableOpacity
                onPress={() => updateFilter('model', undefined)}
                activeOpacity={0.7}
              >
                <X size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderPriceRange = () => (
    <View style={styles.priceContainer}>
      <View style={styles.priceInputContainer}>
        <Text style={styles.priceLabel}>Min {t('price')}</Text>
        <TextInput
          style={styles.priceInput}
          value={localFilters.minPrice?.toString() || ''}
          onChangeText={(text) => updateFilter('minPrice', text ? parseInt(text) : undefined)}
          placeholder="0"
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
        <Text style={styles.currencyLabel}>{t('currency')}</Text>
      </View>
      <View style={styles.priceInputContainer}>
        <Text style={styles.priceLabel}>Max {t('price')}</Text>
        <TextInput
          style={styles.priceInput}
          value={localFilters.maxPrice?.toString() || ''}
          onChangeText={(text) => updateFilter('maxPrice', text ? parseInt(text) : undefined)}
          placeholder="∞"
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
        <Text style={styles.currencyLabel}>{t('currency')}</Text>
      </View>
    </View>
  );

  const renderYearRange = () => (
    <View style={styles.priceContainer}>
      <View style={styles.priceInputContainer}>
        <Text style={styles.priceLabel}>Min {t('year')}</Text>
        <TextInput
          style={styles.priceInput}
          value={localFilters.minYear?.toString() || ''}
          onChangeText={(text) => updateFilter('minYear', text ? parseInt(text) : undefined)}
          placeholder="1990"
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
      </View>
      <View style={styles.priceInputContainer}>
        <Text style={styles.priceLabel}>Max {t('year')}</Text>
        <TextInput
          style={styles.priceInput}
          value={localFilters.maxYear?.toString() || ''}
          onChangeText={(text) => updateFilter('maxYear', text ? parseInt(text) : undefined)}
          placeholder="2024"
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );

  const renderMileageRange = () => (
    <View style={styles.priceContainer}>
      <View style={styles.priceInputContainer}>
        <Text style={styles.priceLabel}>Min {t('mileage')}</Text>
        <TextInput
          style={styles.priceInput}
          value={localFilters.minMileage?.toString() || ''}
          onChangeText={(text) => updateFilter('minMileage', text ? parseInt(text) : undefined)}
          placeholder="0"
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
        <Text style={styles.currencyLabel}>km</Text>
      </View>
      <View style={styles.priceInputContainer}>
        <Text style={styles.priceLabel}>Max {t('mileage')}</Text>
        <TextInput
          style={styles.priceInput}
          value={localFilters.maxMileage?.toString() || ''}
          onChangeText={(text) => updateFilter('maxMileage', text ? parseInt(text) : undefined)}
          placeholder="∞"
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
        <Text style={styles.currencyLabel}>km</Text>
      </View>
    </View>
  );

  const renderLocationDropdowns = () => (
    <View style={styles.locationContainer}>
      {/* Country Dropdown */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.inputLabel}>Country</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowCountryDropdown(!showCountryDropdown)}
          activeOpacity={0.7}
        >
          <Text style={[styles.dropdownText, !selectedCountry && styles.placeholderText]}>
            {selectedCountry ? selectedCountry.name : 'Select Country'}
          </Text>
          <ChevronDown size={20} color="#A3A3A3" />
        </TouchableOpacity>
      </View>

      {/* City Dropdown */}
      {selectedCountry && (
        <View style={styles.dropdownContainer}>
          <Text style={styles.inputLabel}>City</Text>
          <TouchableOpacity
            style={[styles.dropdown, loadingCities && styles.dropdownDisabled]}
            onPress={() => !loadingCities && setShowCityDropdown(!showCityDropdown)}
            activeOpacity={0.7}
            disabled={loadingCities}
          >
            <Text style={[styles.dropdownText, !selectedCity && styles.placeholderText]}>
              {loadingCities ? 'Loading cities...' : selectedCity ? selectedCity.name : 'Select City'}
            </Text>
            {loadingCities ? (
              <ActivityIndicator size="small" color="#A3A3A3" />
            ) : (
              <ChevronDown size={20} color="#A3A3A3" />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const getActiveFiltersCount = () => {
    return Object.values(localFilters).filter(value => value !== undefined && value !== '').length;
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Sliders size={24} color="#EF4444" />
              <Text style={styles.headerTitle}>Filters</Text>
              {getActiveFiltersCount() > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton} activeOpacity={0.7}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {renderSection('Location', 'location', renderLocationDropdowns())}

            {renderSection(
              'Category',
              'category',
              renderMultiSelect(categories, localFilters.category, (value) =>
                updateFilter('category', value as VehicleCategory)
              )
            )}

            {renderSection('Make & Model', 'makeModel', renderMakeModelSelector())}

            {renderSection(`${t('price')} Range`, 'price', renderPriceRange())}

            {renderSection(`${t('year')} Range`, 'year', renderYearRange())}

            {renderSection(
              t('condition'),
              'condition',
              renderMultiSelect(conditions, localFilters.condition, (value) =>
                updateFilter('condition', value as VehicleCondition)
              )
            )}

            {renderSection('Vehicle Specifications', 'specs', (
              <View>
                <View style={styles.specSection}>
                  <Text style={styles.specTitle}>{t('fuelType')}</Text>
                  {renderMultiSelect(fuelTypes, localFilters.fuelType, (value) =>
                    updateFilter('fuelType', value as FuelType)
                  )}
                </View>
                <View style={styles.specSection}>
                  <Text style={styles.specTitle}>{t('transmission')}</Text>
                  {renderMultiSelect(transmissionTypes, localFilters.transmission, (value) =>
                    updateFilter('transmission', value as TransmissionType)
                  )}
                </View>
                <View style={styles.specSection}>
                  <Text style={styles.specTitle}>{t('mileage')} Range</Text>
                  {renderMileageRange()}
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset} activeOpacity={0.7}>
              <Text style={styles.resetButtonText}>Reset All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply} activeOpacity={0.7}>
              <Text style={styles.applyButtonText}>
                Apply Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Country Selection Modal */}
      <Modal
        visible={showCountryDropdown}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCountryDropdown(false)}
      >
        <View style={styles.fullscreenModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <TouchableOpacity
              onPress={() => setShowCountryDropdown(false)}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScrollView}>
            <TouchableOpacity
              key="all"
              style={styles.modalItem}
              onPress={() => {
                setSelectedCountry(null);
                setSelectedCity(null);
                setCities([]);
                updateFilter('countryId', undefined);
                updateFilter('cityId', undefined);
                setShowCountryDropdown(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.modalItemText, !selectedCountry && { color: '#EF4444', fontWeight: 'bold' }]}>
                All Countries
              </Text>
              <ChevronRight size={20} color="#A3A3A3" />
            </TouchableOpacity>
            {countries.map((country) => (
              <TouchableOpacity
                key={country.id}
                style={styles.modalItem}
                onPress={() => handleCountrySelect(country)}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalItemText, selectedCountry?.id === country.id && { color: '#EF4444', fontWeight: 'bold' }]}>
                  {country.name}
                </Text>
                <ChevronRight size={20} color="#A3A3A3" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* City Selection Modal */}
      <Modal
        visible={showCityDropdown}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCityDropdown(false)}
      >
        <View style={styles.fullscreenModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select City</Text>
            <TouchableOpacity
              onPress={() => setShowCityDropdown(false)}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScrollView}>
            <TouchableOpacity
              key="all"
              style={styles.modalItem}
              onPress={() => {
                setSelectedCity(null);
                updateFilter('cityId', undefined);
                setShowCountryDropdown(false);
                setShowCityDropdown(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.modalItemText, !selectedCity && { color: '#EF4444', fontWeight: 'bold' }]}>
                All Cities
              </Text>
              <ChevronRight size={20} color="#A3A3A3" />
            </TouchableOpacity>
            {loadingCities ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#EF4444" />
                <Text style={styles.loadingText}>Loading cities...</Text>

              </View>


            ) : cities.length > 0 ? (
              cities.map((city) => (
                <TouchableOpacity
                  key={city.id}
                  style={styles.modalItem}
                  onPress={() => handleCitySelect(city)}
                  activeOpacity={0.7}
                >
                <Text style={[styles.modalItemText, selectedCity?.id === city.id && { color: '#EF4444', fontWeight: 'bold' }]}>
  {city.name}
</Text>
                  <ChevronRight size={20} color="#A3A3A3" />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No cities available</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal >
      <MakeModelSelector
        visible={showMakeModelSelector}
        onClose={handleMakeModelSelectorClose}
        selectedMake={localFilters.make}
        selectedModel={localFilters.model}
        onMakeSelect={handleMakeSelect}
        onModelSelect={handleModelSelect}
      />
    </>
  );
};

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
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#2a2b2b',
    borderBottomWidth: 1,
    borderBottomColor: '#525353',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  filterBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#2a2b2b',
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#404141',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  multiSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  multiSelectOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#404141',
    borderWidth: 1,
    borderColor: '#525353',
  },
  multiSelectOptionActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  multiSelectOptionText: {
    fontSize: 14,
    color: '#A3A3A3',
    fontWeight: '500',
  },
  multiSelectOptionTextActive: {
    color: '#FFFFFF',
  },
  makeModelContainer: {
    marginTop: 12,
  },
  makeModelButton: {
    backgroundColor: '#404141',
    borderWidth: 1,
    borderColor: '#525353',
    borderRadius: 12,
    padding: 16,
    minHeight: 60,
  },
  makeModelContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  makeModelInfo: {
    flex: 1,
  },
  makeModelLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A3A3A3',
    marginBottom: 4,
  },
  makeModelValue: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  selectedMakeModel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7F1D1D',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  selectedItemText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A3A3A3',
    marginBottom: 8,
  },
  priceInput: {
    backgroundColor: '#404141',
    borderWidth: 1,
    borderColor: '#525353',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  currencyLabel: {
    fontSize: 12,
    color: '#A3A3A3',
    textAlign: 'center',
    marginTop: 4,
  },
  specSection: {
    marginBottom: 20,
  },
  specTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A3A3A3',
    marginBottom: 8,
  },
  locationContainer: {
    marginTop: 12,
    gap: 16,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#404141',
    borderWidth: 1,
    borderColor: '#525353',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  dropdownDisabled: {
    opacity: 0.6,
  },
  dropdownText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  placeholderText: {
    color: '#A3A3A3',
  },
  fullscreenModal: {
    flex: 1,
    backgroundColor: '#1b1c1c',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#2a2b2b',
    borderBottomWidth: 1,
    borderBottomColor: '#525353',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalScrollView: {
    flex: 1,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#2a2b2b',
    borderBottomWidth: 1,
    borderBottomColor: '#404141',
  },
  modalItemText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#A3A3A3',
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#A3A3A3',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A3A3A3',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#404141',
    borderWidth: 1,
    borderColor: '#525353',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#2a2b2b',
    borderTopWidth: 1,
    borderTopColor: '#525353',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#404141',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#525353',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A3A3A3',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});