export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  location?: string;
  createdAt: Date;
  isVerified: boolean;
}

export interface Seller {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  location: string;
  memberSince: string;
  responseTime?: string;
  phone?: string;
}

export interface Dealer {
  id: string;
  name: string;
  type: 'dealer' | 'individual';
  avatar?: string;
  coverImage?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  location: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  specialties: string[];
  totalCars: number;
  yearsInBusiness: number;
  workingHours?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  memberSince: string;
  responseTime?: string;
  createdAt: Date;
}

export interface Vehicle {
  id: string;
  sellerId: string;
  seller: Seller;
  title: string;
  description: string;
  category: VehicleCategory;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  condition: VehicleCondition;
  mileage: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  location: string;
  images: string[];
  features: string[];
  isPromoted: boolean;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  isFavorited: boolean;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  vehicleTitle: string;
  createdAt: Date;
}

export type VehicleCategory = 'car' | 'motorcycle' | 'truck' | 'large-vehicle';

export type VehicleCondition = 'new' | 'used' | 'damaged';

export type FuelType = 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'lpg' | 'cng';

export type TransmissionType = 'manual' | 'automatic' | 'cvt';

export interface SearchFilters {
  category?: VehicleCategory;
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  condition?: VehicleCondition;
  fuelType?: FuelType;
  transmission?: TransmissionType;
  countryId?: number;
  cityId?: number;
  minMileage?: number;
  maxMileage?: number;
}

export type Language = 'sq' | 'en' | 'de';

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  language: Language;
  favorites: string[];
  searchHistory: string[];
  isLoading?: boolean;
}