
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  sku?: string;
  status: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  data: T;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const productsApi = {
  getAll: async (params?: { filters?: any }): Promise<{ data: Product[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<Product[]>> = await apiClient.get(`${API_URL}/products`, { 
        params: params?.filters 
      });
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  get: async (id: string): Promise<{ data: Product }> => {
    try {
      const response: AxiosResponse<ApiResponse<Product>> = await apiClient.get(`${API_URL}/products/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (data: Omit<Product, "id" | "created_at" | "updated_at">): Promise<{ data: Product }> => {
    try {
      const response: AxiosResponse<ApiResponse<Product>> = await apiClient.post(`${API_URL}/products`, data);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  update: async (id: string, data: Partial<Omit<Product, "id" | "created_at" | "updated_at">>): Promise<{ data: Product }> => {
    try {
      const response: AxiosResponse<ApiResponse<Product>> = await apiClient.put(`${API_URL}/products/${id}`, data);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`${API_URL}/products/${id}`);
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  },

  // Upload product image
  uploadImage: async (id: string, file: File): Promise<{ image_url: string }> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response: AxiosResponse<{ image_url: string }> = await apiClient.post(
        `${API_URL}/products/${id}/image`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error uploading image for product ${id}:`, error);
      throw error;
    }
  },

  // Get product categories
  getCategories: async (): Promise<{ data: string[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<string[]>> = await apiClient.get(`${API_URL}/products/categories`);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching product categories:', error);
      throw error;
    }
  }
};
