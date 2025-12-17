import { LoginData, LoginResponse } from '@/components/hooks/useLogin';
import { RegisterData } from '@/components/hooks/useRegister';
import { API_URL } from '../api/api';

export interface RegisterResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    nama_lengkap: string;
    role: string;
  };
  message: string;
}

export class AuthService {
  static async login(loginData: LoginData): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  }

  static async register(registerData: RegisterData): Promise<RegisterResponse> {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  }

  static async validateToken(token: string): Promise<boolean> {
    return true;
  }
}