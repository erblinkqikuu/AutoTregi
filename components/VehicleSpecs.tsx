import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Car, Calendar, Gauge, Fuel, Settings, Wrench } from 'lucide-react-native';
import { Vehicle } from '@/types';
import { useTranslation } from '@/contexts/TranslationContext';

interface VehicleSpecsProps {
  vehicle: Vehicle;
}

export const VehicleSpecs: React.FC<VehicleSpecsProps> = ({ vehicle }) => {
  const { t } = useTranslation();

  const specs = [
    {
      icon: Car,
      label: 'Category',
      value: t(vehicle.category),
    },
    {
      icon: Wrench,
      label: t('make'),
      value: vehicle.make,
    },
    {
      icon: Car,
      label: t('model'),
      value: vehicle.model,
    },
    {
      icon: Calendar,
      label: t('year'),
      value: vehicle.year.toString(),
    },
    {
      icon: Gauge,
      label: t('mileage'),
      value: `${vehicle.mileage.toLocaleString()} km`,
    },
    {
      icon: Fuel,
      label: t('fuelType'),
      value: t(vehicle.fuelType),
    },
    {
      icon: Settings,
      label: t('transmission'),
      value: t(vehicle.transmission),
    },
    {
      icon: Car,
      label: t('condition'),
      value: t(vehicle.condition),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehicle Specifications</Text>
      <View style={styles.specsGrid}>
        {specs.map((spec, index) => {
          const Icon = spec.icon;
          return (
            <View key={index} style={styles.specItem}>
              <View style={styles.specIcon}>
                <Icon size={20} color="#FFFFFF" />
              </View>
              <View style={styles.specContent}>
                <Text style={styles.specLabel}>{spec.label}</Text>
                <Text style={styles.specValue}>{spec.value}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

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
    marginBottom: 16,
  },
  specsGrid: {
    gap: 12,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#404141',
  },
  specIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  specContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specLabel: {
    fontSize: 14,
    color: '#A3A3A3',
    fontWeight: '500',
  },
  specValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});