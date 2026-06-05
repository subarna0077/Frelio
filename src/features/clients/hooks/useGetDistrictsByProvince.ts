import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import type { District } from '../types/types';

export const useGetDistrictsByProvince = (provinceId: number) => {
  const getDistricts = async () => {
    const { data, error } = await supabase
      .from('districts')
      .select('*')
      .eq('province_id', provinceId);

    if (error) throw error;
    return data;
  };

  return useQuery<District[]>({
    queryKey: ['districts', provinceId], // Makes the query cache unique to each provinceId
    queryFn: getDistricts,
    enabled: !!provinceId, // Prevents fetching if provinceId is null, undefined, or 0
  });
};
