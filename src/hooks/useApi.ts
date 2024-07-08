import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// useApi is a hook to call all the APIs in the project dynamically

const useApi = <T>(url: string, config?: AxiosRequestConfig): ApiResponse<T> => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null); // Initialize with null to avoid check

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(url, config);
        setData(response.data); // Set data when successful
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, [url, config]);

  return { data, loading, error };
};

export default useApi;
