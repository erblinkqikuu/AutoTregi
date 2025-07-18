import { useState, useEffect } from 'react';
import { apiService, TransformedVehicle } from '@/data/apiService';

interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface UseApiVehiclesResult {
  allVehicles: TransformedVehicle[];
  loadingAll: boolean;
  error: string | null;
  fetchAllForFiltering: () => Promise<void>;
}

export const useApiVehicles = (): UseApiVehiclesResult => {
  const [allVehicles, setAllVehicles] = useState<TransformedVehicle[]>([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchAllForFiltering = async () => {
    try {
      setLoadingAll(true);
      setError(null);
      const allFetchedVehicles = await apiService.fetchAllVehicles();
      setAllVehicles(allFetchedVehicles);
      console.log(`🎯 Set ${allFetchedVehicles.length} vehicles for filtering`);
    } catch (err) {
      console.error('Error fetching all vehicles:', err);
      
      let errorMessage = 'Failed to fetch all vehicles for filtering';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoadingAll(false);
    }
  };
  useEffect(() => {
    fetchAllForFiltering();
  }, []);


  return {
    allVehicles,
    loadingAll,
    error,
    fetchAllForFiltering,
  };
};