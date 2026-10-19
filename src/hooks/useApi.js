import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export const useApiQuery = ({ url, params = {}, enabled = true, queryKey, options = {} }) => {
  const finalQueryKey = queryKey || [url, params];

  return useQuery({
    queryKey: finalQueryKey,
    queryFn: async () => {
      const response = await axiosInstance.get(url, { params });
      return response.data;
    },
    enabled,
    ...options,
  });
};

export const useApiMutation = ({ url, method = "POST", options = {} }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ url: customUrl, data, params, headers = {} }) => {
      const targetUrl = customUrl || url;
      const response = await axiosInstance({
        url: targetUrl,
        method,
        data,
        params,
        headers,
      });
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      if (options.invalidateQueries) {
        queryClient.invalidateQueries({ queryKey: options.invalidateQueries });
      }
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};