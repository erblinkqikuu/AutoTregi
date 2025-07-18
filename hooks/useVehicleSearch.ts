import { useMemo } from 'react';
import { VehicleCategory, SearchFilters } from '@/types';
import { TransformedVehicle } from '@/data/apiService';

export type SortOption = 'date-desc' | 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc' | 'mileage-asc' | 'mileage-desc';

interface FilterSummary {
  count: number;
  activeFilters: string[];
}

interface UseVehicleSearchResult {
  filteredVehicles: TransformedVehicle[];
  getFilterSummary: () => FilterSummary;
  getSortedVehicles: (sortBy: SortOption) => TransformedVehicle[];
}

export const useVehicleSearch = (
  vehicles: TransformedVehicle[],
  filters: SearchFilters,
  searchQuery: string
): UseVehicleSearchResult => {
  
  const filteredVehicles = useMemo(() => {
    let filtered = [...vehicles];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(vehicle => 
        vehicle.title.toLowerCase().includes(query) ||
        vehicle.make.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.address.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(vehicle => vehicle.category === filters.category);
    }

    // Apply country filter using country_id
    if (filters.countryId !== undefined) {
      filtered = filtered.filter(vehicle => {
        return vehicle.countryId === filters.countryId;
      });
    }

    // Apply city filter using city_id (more specific than country)
    if (filters.cityId !== undefined) {
      filtered = filtered.filter(vehicle => {
        return vehicle.cityId === filters.cityId;
      });
    }

    // Apply price range filter
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      filtered = filtered.filter(vehicle => {
        const price = vehicle.price;
        const minCheck = filters.priceMin === undefined || price >= filters.priceMin;
        const maxCheck = filters.priceMax === undefined || price <= filters.priceMax;
        return minCheck && maxCheck;
      });
    }

    // Apply year range filter
    if (filters.yearMin !== undefined || filters.yearMax !== undefined) {
      filtered = filtered.filter(vehicle => {
        const year = vehicle.year;
        const minCheck = filters.yearMin === undefined || year >= filters.yearMin;
        const maxCheck = filters.yearMax === undefined || year <= filters.yearMax;
        return minCheck && maxCheck;
      });
    }

    // Apply mileage range filter
    if (filters.mileageMin !== undefined || filters.mileageMax !== undefined) {
      filtered = filtered.filter(vehicle => {
        const mileage = vehicle.mileage;
        const minCheck = filters.mileageMin === undefined || mileage >= filters.mileageMin;
        const maxCheck = filters.mileageMax === undefined || mileage <= filters.mileageMax;
        return minCheck && maxCheck;
      });
    }

    // Apply make filter
    if (filters.make) {
      filtered = filtered.filter(vehicle => 
        vehicle.make.toLowerCase() === filters.make?.toLowerCase()
      );
    }

    // Apply model filter
    if (filters.model) {
      filtered = filtered.filter(vehicle => 
        vehicle.model.toLowerCase() === filters.model?.toLowerCase()
      );
    }

    // Apply fuel type filter
    if (filters.fuelType) {
      filtered = filtered.filter(vehicle => 
        vehicle.fuelType.toLowerCase() === filters.fuelType?.toLowerCase()
      );
    }

    // Apply transmission filter
    if (filters.transmission) {
      filtered = filtered.filter(vehicle => 
        vehicle.transmission.toLowerCase() === filters.transmission?.toLowerCase()
      );
    }

    return filtered;
  }, [vehicles, filters, searchQuery]);

  const getFilterSummary = (): FilterSummary => {
    const activeFilters: string[] = [];
    let count = 0;

    if (filters.category) {
      activeFilters.push('Category');
      count++;
    }
    if (filters.countryId !== undefined) {
      activeFilters.push('Country');
      count++;
    }
    if (filters.cityId !== undefined) {
      activeFilters.push('Location');
      count++;
    }
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      activeFilters.push('Price');
      count++;
    }
    if (filters.yearMin !== undefined || filters.yearMax !== undefined) {
      activeFilters.push('Year');
      count++;
    }
    if (filters.mileageMin !== undefined || filters.mileageMax !== undefined) {
      activeFilters.push('Mileage');
      count++;
    }
    if (filters.make) {
      activeFilters.push('Make');
      count++;
    }
    if (filters.model) {
      activeFilters.push('Model');
      count++;
    }
    if (filters.fuelType) {
      activeFilters.push('Fuel Type');
      count++;
    }
    if (filters.transmission) {
      activeFilters.push('Transmission');
      count++;
    }

    return { count, activeFilters };
  };

  const getSortedVehicles = (sortBy: SortOption): TransformedVehicle[] => {
    const sorted = [...filteredVehicles];

    switch (sortBy) {
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'year-desc':
        return sorted.sort((a, b) => b.year - a.year);
      case 'year-asc':
        return sorted.sort((a, b) => a.year - b.year);
      case 'mileage-asc':
        return sorted.sort((a, b) => a.mileage - b.mileage);
      case 'mileage-desc':
        return sorted.sort((a, b) => b.mileage - a.mileage);
      default:
        return sorted;
    }
  };

  return {
    filteredVehicles,
    getFilterSummary,
    getSortedVehicles,
  };
};