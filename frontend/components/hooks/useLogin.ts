import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { API_URL } from '@/components/api/api';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    role: string;
  };
  message?: string;
}

export interface UseLoginReturn {
  username: string;
  password: string;
  secure: boolean;
  loading: boolean;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setSecure: (secure: boolean) => void;
  handleToggleSecure: () => void;
  handleLogin: () => Promise<void>;
}

export const useLogin = (): UseLoginReturn => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleToggleSecure = () => setSecure(prev => !prev);

  const handleLogin = async (): Promise<void> => {
    if (!username || !password) {
      alert('Username dan password wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      const response = await performLogin({ username, password });
      
      if (response) {
        await handleSuccessfulLogin(response);
      }
    } catch (error) {
      handleLoginError(error);
    } finally {
      setLoading(false);
    }
  };

  const performLogin = async (loginData: LoginData): Promise<LoginResponse | null> => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Cek username/password Anda');
      return null;
    }

    return data;
  };

  const handleSuccessfulLogin = async (data: LoginResponse): Promise<void> => {
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('role', data.user.role);

    switch (data.user.role) {
      case 'peneliti':
        router.replace('/(peneliti)');
        break;
      case 'pemerintah':
        router.replace('/(pemerintah)');
        break;
      default:
        alert('Role tidak dikenali');
    }
  };

  const handleLoginError = (error: any): void => {
    console.error('Login error:', error);
    alert('Tidak bisa terhubung ke server');
  };

  return {
    username,
    password,
    secure,
    loading,
    setUsername,
    setPassword,
    setSecure,
    handleToggleSecure,
    handleLogin,
  };
};