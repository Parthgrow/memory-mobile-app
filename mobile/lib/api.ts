const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8001';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    email: string;
  };
}

export interface VerifyRequest {
  token: string;
}

export interface VerifyResponse {
  valid: boolean;
  user?: {
    email: string;
  };
  error?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || 'An error occurred',
      };
    }

    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export const api = {
  register: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    return request<AuthResponse>('/api/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    return request<AuthResponse>('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  verify: async (token: string): Promise<ApiResponse<VerifyResponse>> => {
    return request<VerifyResponse>('/api/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },
};

