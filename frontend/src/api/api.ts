import axios, { AxiosRequestConfig } from "axios";
import { useCallback, useEffect, useState } from "react";

interface Error {
  message: string;
  statusCode: number;
  error: string;
}

export const useApi = () => {
  const api = axios.create({ baseURL: "http://localhost:9000/" });

  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const fetchData = useCallback(async (options: AxiosRequestConfig) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await api(options);
      setError(null);
      setLoading(false);
      return response;
    } catch (err: any) {
      setError(err?.response?.data);
      setLoading(false);
      return err?.response;
    }
  }, []);

  return { error, loading, fetchData };
};
