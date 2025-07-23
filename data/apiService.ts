export interface ApiVehicle {
  id: string;
  title: string;
  brand: {
    name: string;
  };
  year: string;
  offer_price: string;
  mileage: string;
  transmission: string;
  condition: string;
  thumb_image: string;
  description?: string;
  fuel_type?: string;
  location?: string;
  address?: string;
  country_id?: number;
  city_id?: number;
  features?: string[];
  created_at: string;
  views?: number;
  is_promoted?: boolean;
  seller?: {
    id: string;
    name: string;
    phone?: string;
    avatar?: string;
    rating?: number;
    review_count?: number;
    is_verified?: boolean;
    location?: string;
    member_since?: string;
    response_time?: string;
  };
}

export interface ApiResponse {
  cars: {
    data: ApiVehicle[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url?: string;
    prev_page_url?: string;
  };
}

export interface TransformedVehicle {
  id: string;
  sellerId: string;
  seller: {
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
  };
  title: string;
  description: string;
  category: 'car' | 'motorcycle' | 'truck' | 'large-vehicle';
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  condition: 'new' | 'used' | 'damaged';
  mileage: number;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'lpg' | 'cng';
  transmission: 'manual' | 'automatic' | 'cvt';
  location: string;
  countryId?: number;
  cityId?: number;
  images: string[];
  features: string[];
  isPromoted: boolean;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  isFavorited: boolean;
}

// Add import for wishlist hook
import { useWishlist } from '@/hooks/useWishlist';

class ApiService {
  private baseUrl = 'http://127.0.0.1:8000';
  private apiUrl = `${this.baseUrl}/api/listings`;
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  private async fetchWithRetry(url: string, options: RequestInit, retries = this.maxRetries): Promise<Response> {
    try {
      const response = await fetch(url, {
        ...options,
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      return response;
    } catch (error) {
      console.error(`Fetch attempt failed (${this.maxRetries - retries + 1}/${this.maxRetries}):`, error);
      
      if (retries > 0) {
        console.log(`Retrying in ${this.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.fetchWithRetry(url, options, retries - 1);
      }
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
          throw new Error('Request timeout - please check your internet connection');
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Network error - please check your internet connection or try again later');
        }
        if (error.message.includes('CORS')) {
          throw new Error('CORS error - unable to connect to the server');
        }
      }
      
      throw error;
    }
  }

  async fetchVehicles(page: number = 1): Promise<{
    vehicles: TransformedVehicle[];
    pagination: {
      currentPage: number;
      lastPage: number;
      perPage: number;
      total: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    try {
      const url = `${this.apiUrl}?page=${page}`;
      const response = await this.fetchWithRetry(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('API endpoint not found');
        }
        if (response.status === 500) {
          throw new Error('Server error - please try again later');
        }
        if (response.status >= 400 && response.status < 500) {
          throw new Error(`Client error (${response.status}) - please check your request`);
        }
        throw new Error(`Server error (${response.status}) - please try again later`);
      }

      const data: ApiResponse = await response.json();
      
      if (!data.cars?.data || !Array.isArray(data.cars.data)) {
        console.warn('No cars data found in API response');
        return {
          vehicles: [],
          pagination: {
            currentPage: 1,
            lastPage: 1,
            perPage: 10,
            total: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
      }

      const vehicles = data.cars.data.map(this.transformVehicle);
      const pagination = {
        currentPage: data.cars.current_page,
        lastPage: data.cars.last_page,
        perPage: data.cars.per_page,
        total: data.cars.total,
        hasNextPage: data.cars.current_page < data.cars.last_page,
        hasPrevPage: data.cars.current_page > 1,
      };

      return { vehicles, pagination };
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      
      // Re-throw with more user-friendly message if it's a generic error
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred while fetching vehicles');
      }
    }
  }

  async fetchAllVehicles(): Promise<TransformedVehicle[]> {
    try {
      console.log('🔄 Fetching all vehicles for filtering...');
      
      // First, get the first page to know total pages
      const firstPageResult = await this.fetchVehicles(1);
      const { lastPage } = firstPageResult.pagination;
      let allVehicles = [...firstPageResult.vehicles];
      
      console.log(`📄 Total pages to fetch: ${lastPage}`);
      
      // If there are more pages, fetch them all
      if (lastPage > 1) {
        const pagePromises = [];
        
        // Create promises for all remaining pages
        for (let page = 2; page <= lastPage; page++) {
          pagePromises.push(this.fetchVehicles(page));
        }
        
        // Fetch all pages in parallel
        const pageResults = await Promise.all(pagePromises);
        
        // Combine all vehicles
        pageResults.forEach(result => {
          allVehicles.push(...result.vehicles);
        });
      }
      
      console.log(`✅ Fetched ${allVehicles.length} total vehicles from ${lastPage} pages`);
      return allVehicles;
      
    } catch (error) {
      console.error('Error fetching all vehicles:', error);
      throw error;
    }
  }
  private transformVehicle = (apiVehicle: ApiVehicle): TransformedVehicle => {
    // Note: isFavorited will be determined by the useWishlist hook in components
    // Transform image path
    const getImageUrl = (imagePath: string) => {
      if (!imagePath) return 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800';
      const cleanPath = imagePath.replace(/\\/g, '/');
      return cleanPath.startsWith('http') ? cleanPath : `${this.baseUrl}/${cleanPath}`;
    };

    // Parse price
    const price = parseFloat(apiVehicle.offer_price?.replace(/[,\s]/g, '') || '0');

    // Parse mileage
    const mileage = parseFloat(apiVehicle.mileage?.replace(/[,\s]/g, '') || '0');

    // Parse year
    const year = parseInt(apiVehicle.year || '2020');

    // Determine category based on brand or title
    const getCategory = (title: string, brand: string): 'car' | 'motorcycle' | 'truck' | 'large-vehicle' => {
      const lowerTitle = title.toLowerCase();
      const lowerBrand = brand.toLowerCase();
      
      if (lowerTitle.includes('motorcycle') || lowerTitle.includes('bike') || 
          ['yamaha', 'honda', 'kawasaki', 'suzuki', 'ducati', 'bmw'].some(b => lowerBrand.includes(b) && (lowerTitle.includes('r1') || lowerTitle.includes('cbr') || lowerTitle.includes('ninja')))) {
        return 'motorcycle';
      }
      if (lowerTitle.includes('truck') || lowerTitle.includes('van') || lowerTitle.includes('crafter')) {
        return 'truck';
      }
      if (lowerTitle.includes('bus') || lowerTitle.includes('large')) {
        return 'large-vehicle';
      }
      return 'car';
    };

    // Normalize transmission
    const normalizeTransmission = (transmission: string): 'manual' | 'automatic' | 'cvt' => {
      const lower = transmission?.toLowerCase() || '';
      if (lower.includes('automatic') || lower.includes('auto')) return 'automatic';
      if (lower.includes('cvt')) return 'cvt';
      return 'manual';
    };

    // Normalize fuel type
    const normalizeFuelType = (fuelType?: string): 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'lpg' | 'cng' => {
      const lower = fuelType?.toLowerCase() || '';
      if (lower.includes('diesel')) return 'diesel';
      if (lower.includes('electric')) return 'electric';
      if (lower.includes('hybrid')) return 'hybrid';
      if (lower.includes('lpg')) return 'lpg';
      if (lower.includes('cng')) return 'cng';
      return 'gasoline';
    };

    // Normalize condition
    const normalizeCondition = (condition: string): 'new' | 'used' | 'damaged' => {
      const lower = condition?.toLowerCase() || '';
      if (lower.includes('new')) return 'new';
      if (lower.includes('damaged')) return 'damaged';
      return 'used';
    };

    const transformedVehicle = {
      id: apiVehicle.id,
      sellerId: apiVehicle.seller?.id || '1',
      seller: {
        id: apiVehicle.seller?.id || '1',
        name: apiVehicle.seller?.name || 'Seller',
        avatar: apiVehicle.seller?.avatar ? getImageUrl(apiVehicle.seller.avatar) : undefined,
        rating: apiVehicle.seller?.rating || 4.5,
        reviewCount: apiVehicle.seller?.review_count || 0,
        isVerified: apiVehicle.seller?.is_verified || false,
        location: apiVehicle.seller?.location || apiVehicle.address || apiVehicle.location || 'Tiranë, Shqipëri',
        memberSince: apiVehicle.seller?.member_since || 'Jan 2023',
        responseTime: apiVehicle.seller?.response_time,
        phone: apiVehicle.seller?.phone,
      },
      title: apiVehicle.title || 'Vehicle',
      description: apiVehicle.description || 'No description available',
      category: getCategory(apiVehicle.title || '', apiVehicle.brand?.name || ''),
      make: apiVehicle.brand?.name || 'Unknown',
      model: apiVehicle.title?.replace(apiVehicle.brand?.name || '', '').trim() || 'Unknown',
      year,
      price,
      currency: '€',
      condition: normalizeCondition(apiVehicle.condition),
      mileage,
      fuelType: normalizeFuelType(apiVehicle.fuel_type),
      transmission: normalizeTransmission(apiVehicle.transmission),
      location: apiVehicle.address || apiVehicle.location || 'Tiranë, Shqipëri',
      countryId: apiVehicle.country_id,
      cityId: apiVehicle.city_id,
      images: [getImageUrl(apiVehicle.thumb_image)],
      features: Array.isArray(apiVehicle.features) ? apiVehicle.features : [],
      isPromoted: apiVehicle.is_promoted || false,
      createdAt: new Date(apiVehicle.created_at || Date.now()),
      updatedAt: new Date(apiVehicle.created_at || Date.now()),
      views: apiVehicle.views || 0,
      isFavorited: false, // This will be set by components using wishlist hook
    };

    // Add address field to the transformed vehicle
    (transformedVehicle as any).address = apiVehicle.address;

    return transformedVehicle;
  };

  // Format price for display
  formatPrice(price: number): string {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  // Format mileage for display
  formatMileage(mileage: number): string {
    return `${mileage.toLocaleString('en-US')} km`;
  }
}

export const apiService = new ApiService();