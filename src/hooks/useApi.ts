// src/hooks/useApi.ts

import { useState, useEffect } from 'react';

type ApiFunction<TParams, TResponse> = (params: TParams) => Promise<TResponse>;

export const useApi = <TParams, TResponse>(
  apiFunction: ApiFunction<TParams, TResponse>,
  params: TParams
) => {
  const [data, setData] = useState<TResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiFunction(params)
      .then(response => {
        setData(response);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiFunction, params]);

  return { data, loading, error };
};
