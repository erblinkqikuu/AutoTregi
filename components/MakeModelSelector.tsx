import React, { useState, useEffect, useMemo } from 'react';
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
  Platform,
  SafeAreaView,
} from 'react-native';
import { X, ChevronRight, Search, ChevronLeft } from 'lucide-react-native';

interface MakeModelSelectorProps {
  visible: boolean;
  onClose: () => void;
  selectedMake?: string;
  selectedModel?: string;
  onMakeSelect: (make: string) => void;
  onModelSelect: (model: string) => void;
}

const { width } = Dimensions.get('window');

// Pagination constants
const BRANDS_PER_PAGE = 15;
const MODELS_PER_PAGE = 20;

// Comprehensive car brands and models data
const carBrands = [
  {
    name: 'Audi',
    models: ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron GT', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8']
  },
  {
    name: 'BMW',
    models: ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'i3', 'i4', 'iX', 'M2', 'M3', 'M4', 'M5', 'M8', 'X3 M', 'X4 M', 'X5 M', 'X6 M']
  },
  {
    name: 'Mercedes-Benz',
    models: ['A-Class', 'B-Class', 'C-Class', 'CLA', 'CLS', 'E-Class', 'S-Class', 'G-Class', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'SL', 'AMG GT', 'EQA', 'EQB', 'EQC', 'EQS', 'EQE', 'AMG C63', 'AMG E63', 'AMG S63', 'AMG G63']
  },
  {
    name: 'Volkswagen',
    models: ['Polo', 'Golf', 'Jetta', 'Passat', 'Arteon', 'T-Cross', 'T-Roc', 'Tiguan', 'Touareg', 'Sharan', 'Touran', 'Caddy', 'Crafter', 'ID.3', 'ID.4', 'ID.5', 'ID.7', 'Golf GTI', 'Golf R', 'Tiguan R']
  },
  {
    name: 'Toyota',
    models: ['Yaris', 'Corolla', 'Camry', 'Avalon', 'Prius', 'C-HR', 'RAV4', 'Highlander', 'Land Cruiser', 'Hilux', 'Proace', 'Mirai', 'bZ4X', 'Supra', 'GR86', 'Prius Prime', 'RAV4 Prime', 'Venza', 'Sienna', '4Runner']
  },
  {
    name: 'Honda',
    models: ['Civic', 'Accord', 'Insight', 'CR-V', 'HR-V', 'Pilot', 'Passport', 'Ridgeline', 'Odyssey', 'Fit', 'City', 'Jazz', 'Civic Type R', 'Accord Hybrid', 'CR-V Hybrid', 'Clarity']
  },
  {
    name: 'Ford',
    models: ['Fiesta', 'Focus', 'Mondeo', 'Mustang', 'EcoSport', 'Kuga', 'Edge', 'Explorer', 'Expedition', 'F-150', 'Ranger', 'Transit', 'Mustang Mach-E', 'Bronco', 'Escape', 'Fusion', 'Taurus', 'Focus ST', 'Focus RS', 'Mustang GT']
  },
  {
    name: 'Opel',
    models: ['Corsa', 'Astra', 'Insignia', 'Crossland', 'Grandland', 'Mokka', 'Combo', 'Vivaro', 'Movano', 'Corsa-e', 'Mokka-e', 'Astra Sports Tourer', 'Insignia Sports Tourer']
  },
  {
    name: 'Peugeot',
    models: ['108', '208', '308', '508', '2008', '3008', '5008', 'Partner', 'Expert', 'Boxer', 'e-208', 'e-2008', 'e-Expert', '308 SW', '508 SW', 'Rifter', 'Traveller']
  },
  {
    name: 'Renault',
    models: ['Clio', 'Megane', 'Talisman', 'Captur', 'Kadjar', 'Koleos', 'Scenic', 'Espace', 'Kangoo', 'Trafic', 'Master', 'ZOE', 'Megane E-Tech', 'Arkana', 'Austral', 'Clio RS', 'Megane RS']
  },
  {
    name: 'Fiat',
    models: ['500', 'Panda', 'Tipo', '500X', '500L', 'Doblo', 'Ducato', 'Fiorino', '500e', 'Punto', 'Bravo', '500 Abarth', 'Panda Cross', 'Tipo Cross']
  },
  {
    name: 'Hyundai',
    models: ['i10', 'i20', 'i30', 'Elantra', 'Sonata', 'Kona', 'Tucson', 'Santa Fe', 'Nexo', 'Ioniq', 'Ioniq 5', 'Ioniq 6', 'i30 N', 'Kona N', 'Veloster N', 'Genesis G70', 'Genesis G80', 'Genesis G90']
  },
  {
    name: 'Kia',
    models: ['Picanto', 'Rio', 'Ceed', 'Forte', 'Optima', 'Stonic', 'Sportage', 'Sorento', 'Soul', 'Niro', 'EV6', 'EV9', 'Proceed', 'XCeed', 'Ceed GT', 'Stinger', 'Carnival', 'Telluride']
  },
  {
    name: 'Nissan',
    models: ['Micra', 'Sentra', 'Altima', 'Maxima', 'Juke', 'Qashqai', 'X-Trail', 'Murano', 'Pathfinder', 'Navara', 'Leaf', 'Ariya', '370Z', 'GT-R', 'Titan', 'Armada', 'Kicks', 'Rogue']
  },
  {
    name: 'Mazda',
    models: ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-30', 'CX-5', 'CX-9', 'MX-5', 'MX-30', 'CX-60', 'CX-90', 'Mazda3 Turbo', 'CX-5 Turbo']
  },
  {
    name: 'Subaru',
    models: ['Impreza', 'Legacy', 'Outback', 'Forester', 'Ascent', 'WRX', 'BRZ', 'Crosstrek', 'WRX STI', 'Forester Wilderness', 'Outback Wilderness']
  },
  {
    name: 'Mitsubishi',
    models: ['Mirage', 'Lancer', 'Eclipse Cross', 'Outlander', 'Pajero', 'L200', 'Outlander PHEV', 'ASX', 'Space Star', 'Lancer Evolution']
  },
  {
    name: 'Suzuki',
    models: ['Alto', 'Swift', 'Baleno', 'Ignis', 'Vitara', 'S-Cross', 'Jimny', 'Across', 'Swift Sport', 'SX4', 'Grand Vitara']
  },
  {
    name: 'Skoda',
    models: ['Citigo', 'Fabia', 'Scala', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq', 'Enyaq', 'Octavia RS', 'Superb SportLine', 'Kodiaq RS']
  },
  {
    name: 'SEAT',
    models: ['Ibiza', 'Leon', 'Toledo', 'Arona', 'Ateca', 'Tarraco', 'Alhambra', 'Mii', 'Leon Cupra', 'Ateca Cupra', 'Tarraco FR']
  },
  {
    name: 'Alfa Romeo',
    models: ['Giulietta', 'Giulia', 'Stelvio', '4C', 'Tonale', 'Giulia Quadrifoglio', 'Stelvio Quadrifoglio', 'MiTo', '159', '147']
  },
  {
    name: 'Jeep',
    models: ['Renegade', 'Compass', 'Cherokee', 'Grand Cherokee', 'Wrangler', 'Gladiator', 'Avenger', 'Wrangler Rubicon', 'Grand Cherokee SRT', 'Cherokee Trailhawk']
  },
  {
    name: 'Land Rover',
    models: ['Defender', 'Discovery Sport', 'Discovery', 'Range Rover Evoque', 'Range Rover Velar', 'Range Rover Sport', 'Range Rover', 'Freelander', 'Range Rover SVR', 'Defender SVX']
  },
  {
    name: 'Jaguar',
    models: ['XE', 'XF', 'XJ', 'F-Type', 'E-Pace', 'F-Pace', 'I-Pace', 'F-Type R', 'XF Sportbrake', 'F-Pace SVR']
  },
  {
    name: 'Volvo',
    models: ['V40', 'S60', 'V60', 'S90', 'V90', 'XC40', 'XC60', 'XC90', 'C40', 'EX30', 'EX90', 'V60 Polestar', 'S60 Polestar', 'XC60 Polestar']
  },
  {
    name: 'Lexus',
    models: ['CT', 'IS', 'ES', 'GS', 'LS', 'UX', 'NX', 'RX', 'GX', 'LX', 'LC', 'RC', 'IS F', 'RC F', 'GS F', 'LFA']
  },
  {
    name: 'Infiniti',
    models: ['Q30', 'Q50', 'Q60', 'Q70', 'QX30', 'QX50', 'QX60', 'QX70', 'QX80', 'Q50 Red Sport', 'Q60 Red Sport']
  },
  {
    name: 'Acura',
    models: ['ILX', 'TLX', 'RLX', 'RDX', 'MDX', 'NSX', 'TLX Type S', 'MDX Type S', 'RDX A-Spec']
  },
  {
    name: 'Genesis',
    models: ['G70', 'G80', 'G90', 'GV60', 'GV70', 'GV80', 'G70 3.3T', 'G80 Sport', 'GV70 Sport']
  },
  {
    name: 'Tesla',
    models: ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck', 'Roadster', 'Model S Plaid', 'Model X Plaid']
  },
  {
    name: 'Porsche',
    models: ['911', 'Boxster', 'Cayman', 'Panamera', 'Cayenne', 'Macan', 'Taycan', '911 Turbo', '911 GT3', 'Cayenne Turbo', 'Panamera Turbo', 'Macan Turbo']
  },
];

export const MakeModelSelector: React.FC<MakeModelSelectorProps> = ({
  visible,
  onClose,
  selectedMake,
  selectedModel,
  onMakeSelect,
  onModelSelect,
}) => {
  const [currentPage, setCurrentPage] = useState<'makes' | 'models'>('makes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [brandsPage, setBrandsPage] = useState(1);
  const [modelsPage, setModelsPage] = useState(1);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // Reset pagination when search changes
  useEffect(() => {
    setBrandsPage(1);
    setModelsPage(1);
  }, [searchQuery]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible) {
      setCurrentPage('makes');
      setSearchQuery('');
      setSelectedBrand('');
      setBrandsPage(1);
      setModelsPage(1);
    }
  }, [visible]);

  // Filtered and paginated brands
  const filteredBrands = useMemo(() => {
    return carBrands.filter(brand =>
      brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const paginatedBrands = useMemo(() => {
    const startIndex = 0;
    const endIndex = brandsPage * BRANDS_PER_PAGE;
    return filteredBrands.slice(startIndex, endIndex);
  }, [filteredBrands, brandsPage]);

  const hasMoreBrands = paginatedBrands.length < filteredBrands.length;

  // Filtered and paginated models
  const selectedBrandData = useMemo(() => {
    return carBrands.find(brand => brand.name === selectedBrand);
  }, [selectedBrand]);

  const filteredModels = useMemo(() => {
    return selectedBrandData?.models.filter(model =>
      model.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
  }, [selectedBrandData, searchQuery]);

  const paginatedModels = useMemo(() => {
    const startIndex = 0;
    const endIndex = modelsPage * MODELS_PER_PAGE;
    return filteredModels.slice(startIndex, endIndex);
  }, [filteredModels, modelsPage]);

  const hasMoreModels = paginatedModels.length < filteredModels.length;

  const loadMoreBrands = () => {
    if (hasMoreBrands && !isLoadingBrands) {
      setIsLoadingBrands(true);
      // Simulate loading delay for smooth UX
      setTimeout(() => {
        setBrandsPage(prev => prev + 1);
        setIsLoadingBrands(false);
      }, 300);
    }
  };

  const loadMoreModels = () => {
    if (hasMoreModels && !isLoadingModels) {
      setIsLoadingModels(true);
      // Simulate loading delay for smooth UX
      setTimeout(() => {
        setModelsPage(prev => prev + 1);
        setIsLoadingModels(false);
      }, 300);
    }
  };

  const handleBrandSelect = (brandName: string) => {
    console.log('Brand selected:', brandName);
    setSelectedBrand(brandName);
    setSearchQuery('');
    setModelsPage(1);
    setCurrentPage('models');
  };

  const handleModelSelect = (model: string) => {
    console.log('Model selected:', model);
    onMakeSelect(selectedBrand);
    onModelSelect(model);
    handleClose();
  };

  const handleBackToMakes = () => {
    setCurrentPage('makes');
    setSearchQuery('');
    setBrandsPage(1);
  };

  const handleClose = () => {
    console.log('Closing MakeModelSelector');
    setCurrentPage('makes');
    setSearchQuery('');
    setSelectedBrand('');
    setBrandsPage(1);
    setModelsPage(1);
    onClose();
  };

  const renderLoadMoreButton = (onPress: () => void, isLoading: boolean, hasMore: boolean) => {
    if (!hasMore) return null;

    return (
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={onPress}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#2563EB" />
        ) : (
          <Text style={styles.loadMoreText}>Load More</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderMakesPage = () => (
    <View style={styles.pageContent}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search brands..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <ScrollView 
        style={styles.brandsContainer} 
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            loadMoreBrands();
          }
        }}
        scrollEventThrottle={400}
      >
        <View style={styles.brandsGrid}>
          {paginatedBrands.map((brand) => (
            <TouchableOpacity
              key={brand.name}
              style={[
                styles.brandCard,
                selectedMake === brand.name && styles.brandCardSelected,
              ]}
              onPress={() => handleBrandSelect(brand.name)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.brandName,
                selectedMake === brand.name && styles.brandNameSelected,
              ]}>
                {brand.name}
              </Text>
              <View style={styles.brandInfo}>
                <Text style={styles.modelCount}>{brand.models.length} models</Text>
                <ChevronRight size={16} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {renderLoadMoreButton(loadMoreBrands, isLoadingBrands, hasMoreBrands)}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );

  const renderModelsPage = () => (
    <View style={styles.pageContent}>
      <View style={styles.modelsHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToMakes} activeOpacity={0.7}>
          <ChevronLeft size={24} color="#2563EB" />
          <Text style={styles.backButtonText}>Back to Brands</Text>
        </TouchableOpacity>
        <Text style={styles.selectedBrandTitle}>{selectedBrand}</Text>
        <Text style={styles.modelCountText}>
          {filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''} available
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search models..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <ScrollView 
        style={styles.modelsContainer} 
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            loadMoreModels();
          }
        }}
        scrollEventThrottle={400}
      >
        <View style={styles.modelsGrid}>
          {paginatedModels.map((model) => (
            <TouchableOpacity
              key={model}
              style={[
                styles.modelCard,
                selectedModel === model && styles.modelCardSelected,
              ]}
              onPress={() => handleModelSelect(model)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.modelName,
                selectedModel === model && styles.modelNameSelected,
              ]}>
                {model}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {renderLoadMoreButton(loadMoreModels, isLoadingModels, hasMoreModels)}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
      statusBarTranslucent={false}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {currentPage === 'makes' ? 'Select Brand' : 'Select Model'}
            </Text>
            {currentPage === 'makes' && (
              <Text style={styles.headerSubtitle}>
                {filteredBrands.length} brand{filteredBrands.length !== 1 ? 's' : ''} available
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton} activeOpacity={0.7}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {currentPage === 'makes' ? renderMakesPage() : renderModelsPage()}
      </SafeAreaView>
    </Modal>
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
    minHeight: 80,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#A3A3A3',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#404141',
  },
  pageContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchContainer: {
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2b2b',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#525353',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    minHeight: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#FFFFFF',
  },
  brandsContainer: {
    flex: 1,
  },
  brandsGrid: {
    gap: 12,
  },
  brandCard: {
    backgroundColor: '#2a2b2b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#525353',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 80,
  },
  brandCardSelected: {
    borderColor: '#EF4444',
    backgroundColor: '#7F1D1D',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  brandNameSelected: {
    color: '#EF4444',
  },
  brandInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modelCount: {
    fontSize: 14,
    color: '#A3A3A3',
  },
  modelsHeader: {
    paddingVertical: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '500',
    marginLeft: 4,
  },
  selectedBrandTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  modelCountText: {
    fontSize: 14,
    color: '#A3A3A3',
  },
  modelsContainer: {
    flex: 1,
  },
  modelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  modelCard: {
    backgroundColor: '#2a2b2b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#525353',
    minWidth: (width - 56) / 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    minHeight: 50,
  },
  modelCardSelected: {
    borderColor: '#EF4444',
    backgroundColor: '#7F1D1D',
  },
  modelName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modelNameSelected: {
    color: '#EF4444',
    fontWeight: '600',
  },
  loadMoreButton: {
    backgroundColor: '#2a2b2b',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#525353',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    minHeight: 50,
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
  },
  bottomSpacing: {
    height: 24,
  },
});