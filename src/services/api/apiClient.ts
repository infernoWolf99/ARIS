/// <reference types="vite/client" />
/**
 * ARIS GHS Antenatal Care Platform
 * NestJS REST API Client Base Layer
 */

export interface ApiResponse<T> {
  statusCode?: number;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp?: string;
}

// Get API base URL from Vite environment variable or default to Express proxy / NestJS default
export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }
  return '/api/v1';
};

// Check if client is configured to connect to NestJS backend directly
export const isNestApiEnabled = (): boolean => {
  const val = import.meta.env.VITE_USE_NEST_API;
  if (val === 'true' || val === true) return true;
  
  // Check local storage setting if set via Developer Portal
  const storedPreference = localStorage.getItem('aris_use_nest_api');
  return storedPreference === 'true';
};

// Get Bearer Token for JWT Authentication
export const getAuthToken = (): string | null => {
  return localStorage.getItem('aris_auth_token') || null;
};

// Generic HTTP Request Wrapper
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        data && typeof data === 'object' && data.message
          ? Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message
          : `HTTP Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    // Handle NestJS standard envelope { statusCode, data } if wrapped
    if (data && typeof data === 'object' && 'data' in data && 'statusCode' in data) {
      return data.data as T;
    }

    return data as T;
  } catch (error: any) {
    console.warn(`[API Client] NestJS endpoint (${url}) request failed:`, error.message);
    throw error;
  }
}
