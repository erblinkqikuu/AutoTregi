import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

interface WishlistCar {
  id: number;
  slug: string;
  brand_id: number;
  expired_date: string | null;
  regular_price: string;
  offer_price: string;
  thumb_image: string;
  purpose: string;
  condition: string;
  is_featured: string;
  status: string;
  approved_by_admin: string;
  title: string;
  description: string;
  video_description: string;
  address: string;
  seo_title: string;
  seo_description: string;
  brand: {
    id: number;
    image: string;
    slug: string;
    status: string;
    created_at: string;
    updated_at: string;
    name: string;
    total_car: number;
  };
}

interface WishlistResponse {
  cars: WishlistCar[];
}

export const useWishlist = () => {
  const [wishlistedCarIds, setWishlistedCarIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get auth token from localStorage
      const accessToken = Platform.OS === 'web' ? localStorage.getItem('access_token') : null;
      
      if (!accessToken) {
        console.log('No access token found, skipping wishlist fetch');
        setWishlistedCarIds(new Set());
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/user/wishlists', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Unauthorized - clearing wishlist');
          setWishlistedCarIds(new Set());
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: WishlistResponse = await response.json();
      
      // Extract car IDs and convert to strings for consistency
      const carIds = new Set(data.cars.map(car => car.id.toString()));
      setWishlistedCarIds(carIds);
      
      console.log('✅ Wishlist loaded:', carIds);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch wishlist');
      // Don't clear wishlist on error, keep existing state
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (carId: string) => {
    try {
      const accessToken = Platform.OS === 'web' ? localStorage.getItem('access_token') : null;
      
      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`http://127.0.0.1:8000/api/user/add-to-wishlist/${carId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Optimistically update local state
      setWishlistedCarIds(prev => new Set([...prev, carId]));
      console.log('✅ Added to wishlist:', carId);
      
      // Refresh wishlist to ensure consistency
      await fetchWishlist();
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      throw err;
    }
  };

  const removeFromWishlist = async (carId: string) => {
    try {
      const accessToken = Platform.OS === 'web' ? localStorage.getItem('access_token') : null;
      
      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`http://127.0.0.1:8000/api/user/remove-wishlist/${carId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Optimistically update local state
      setWishlistedCarIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(carId);
        return newSet;
      });
      console.log('✅ Removed from wishlist:', carId);
      
      // Refresh wishlist to ensure consistency
      await fetchWishlist();
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      throw err;
    }
  };

  const isWishlisted = (carId: string): boolean => {
    return wishlistedCarIds.has(carId);
  };

  const toggleWishlist = async (carId: string) => {
    if (isWishlisted(carId)) {
      await removeFromWishlist(carId);
    } else {
      await addToWishlist(carId);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return {
    wishlistedCarIds: Array.from(wishlistedCarIds),
    loading,
    error,
    isWishlisted,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    refreshWishlist: fetchWishlist,
  };
};