// hooks/useRegister.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthService } from '@/components/services/authService';
import { StorageService } from '@/components/services/storageService';

export type UserRole = 'peneliti' | 'pemerintah';

export interface RegisterData {
  username: string;
  password: string;
  nama_lengkap: string;
  email: string;
  role: UserRole;
}

export interface UseRegisterReturn {
  username: string;
  namaLengkap: string;
  email: string;
  password: string;
  secure: boolean;
  role: UserRole;
  loading: boolean;
  setUsername: (username: string) => void;
  setNamaLengkap: (namaLengkap: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setSecure: (secure: boolean) => void;
  setRole: (role: UserRole) => void;
  handleToggleSecure: () => void;
  handleRegister: () => Promise<void>;
  validateForm: () => boolean;
}

export const useRegister = (): UseRegisterReturn => {
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [role, setRole] = useState<UserRole>('peneliti');
  const [loading, setLoading] = useState(false);

  const handleToggleSecure = () => setSecure(prev => !prev);

  const validateForm = (): boolean => {
    return !!(username && namaLengkap && email && password);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (): Promise<void> => {
    if (!validateForm()) {
      Alert.alert('Error', 'Semua field wajib diisi!');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Format email tidak valid!');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password harus minimal 6 karakter!');
      return;
    }

    setLoading(true);
    try {
      const registerData: RegisterData = {
        username,
        password,
        nama_lengkap: namaLengkap,
        email,
        role,
      };

      await performRegistration(registerData);
      await handleSuccessfulRegistration();
      
    } catch (error) {
      handleRegistrationError(error);
    } finally {
      setLoading(false);
    }
  };

  const performRegistration = async (registerData: RegisterData): Promise<void> => {
    const response = await AuthService.register(registerData);
    
    // Simpan data user setelah registrasi berhasil
    if (response.token) {
      await StorageService.setAuthData(response.token, response.user.role);
    }
  };

  const handleSuccessfulRegistration = async (): Promise<void> => {
    Alert.alert('Sukses', 'Akun berhasil dibuat, silakan login');
    
    // Redirect berdasarkan role atau ke halaman login
    router.replace('/(auth)/login');
  };

  const handleRegistrationError = (error: any): void => {
    console.error('Registration error:', error);
    
    if (error.message.includes('username')) {
      Alert.alert('Error', 'Username sudah digunakan');
    } else if (error.message.includes('email')) {
      Alert.alert('Error', 'Email sudah terdaftar');
    } else {
      Alert.alert('Error', error.message || 'Tidak bisa terhubung ke server');
    }
  };

  return {
    username,
    namaLengkap,
    email,
    password,
    secure,
    role,
    loading,
    setUsername,
    setNamaLengkap,
    setEmail,
    setPassword,
    setSecure,
    setRole,
    handleToggleSecure,
    handleRegister,
    validateForm,
  };
};