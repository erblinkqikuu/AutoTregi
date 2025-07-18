import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Car, Bike, Truck, Bus } from 'lucide-react-native';
import { VehicleCategory } from '@/types';
import { useTranslation } from '@/contexts/TranslationContext';
import { useTheme } from '@/contexts/ThemeContext';

interface CategoryTabsProps {
  selectedCategory: VehicleCategory | null;
  onCategorySelect: (category: VehicleCategory | null) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onCategorySelect,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const categories = [
    {
      key: 'car' as VehicleCategory,
      label: t('cars'),
      icon: Car,
    },
    {
      key: 'motorcycle' as VehicleCategory,
      label: t('motorcycles'),
      icon: Bike,
    },
    {
      key: 'truck' as VehicleCategory,
      label: t('trucks'),
      icon: Truck,
    },
    {
      key: 'large-vehicle' as VehicleCategory,
      label: t('largeVehicles'),
      icon: Bus,
    },
  ];

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[
            styles.tab,
            selectedCategory === null && styles.activeTab,
          ]}
          onPress={() => onCategorySelect(null)}
        >
          <Text
            style={[
              styles.tabText,
              selectedCategory === null && styles.activeTabText,
            ]}
          >
            {t('viewAll')}
          </Text>
        </TouchableOpacity>
        
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.key;
          
          return (
            <TouchableOpacity
              key={category.key}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onCategorySelect(category.key)}
            >
              <Icon
                size={20}
                color={isActive ? '#FFFFFF' : theme.colors.textTertiary}
                style={styles.tabIcon}
              />
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.activeTabText,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 80,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textTertiary,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});