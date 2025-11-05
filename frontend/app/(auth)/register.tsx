import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '@/components/api/api';
import { Ionicons } from '@expo/vector-icons';

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [role, setRole] = useState<'peneliti' | 'pemerintah'>('peneliti');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !namaLengkap || !email || !password) {
      Alert.alert('Error', 'Semua field wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          nama_lengkap: namaLengkap,
          email,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Register gagal', data.message || 'Coba lagi');
      } else {
        Alert.alert('Sukses', 'Akun berhasil dibuat, silakan login');
        router.replace('/(pemerintah)');
      }
    } catch (error) {
      Alert.alert('Error', 'Tidak bisa terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSecure = () => setSecure(prev => !prev);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#2E8B57" />
          </TouchableOpacity>
          <View style={styles.logo}>
            <Ionicons name="person-add" size={32} color="#2E8B57" />
          </View>
          <Text style={styles.title}>Buat Akun Baru</Text>
          <Text style={styles.subtitle}>
            Daftar untuk akses fitur monitoring mangrove
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Nama Lengkap */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput
              value={namaLengkap}
              onChangeText={setNamaLengkap}
              style={styles.input}
              placeholder="Masukkan nama lengkap"
              placeholderTextColor="#999"
            />
          </View>

          {/* Username */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              style={styles.input}
              placeholder="Masukkan username"
              placeholderTextColor="#999"
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              placeholder="Masukkan email"
              placeholderTextColor="#999"
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secure}
                style={styles.passwordInput}
                placeholder="Masukkan password"
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                onPress={handleToggleSecure}
                style={styles.eyeButton}
              >
                <Ionicons 
                  name={secure ? 'eye-off-outline' : 'eye-outline'} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Role Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Peran</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'peneliti' && styles.roleButtonActive
                ]}
                onPress={() => setRole('peneliti')}
              >
                <Ionicons 
                  name="search" 
                  size={20} 
                  color={role === 'peneliti' ? '#FFFFFF' : '#2E8B57'} 
                />
                <Text style={[
                  styles.roleButtonText,
                  role === 'peneliti' && styles.roleButtonTextActive
                ]}>
                  Peneliti
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'pemerintah' && styles.roleButtonActive
                ]}
                onPress={() => setRole('pemerintah')}
              >
                <Ionicons 
                  name="business" 
                  size={20} 
                  color={role === 'pemerintah' ? '#FFFFFF' : '#2E8B57'} 
                />
                <Text style={[
                  styles.roleButtonText,
                  role === 'pemerintah' && styles.roleButtonTextActive
                ]}>
                  Pemerintah
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              (loading || !username || !namaLengkap || !email || !password) && styles.registerButtonDisabled
            ]}
            onPress={handleRegister}
            disabled={loading || !username || !namaLengkap || !email || !password}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Mendaftarkan...' : 'Daftar'}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.loginLink}>Masuk di sini</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({  
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0F9F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    paddingRight: 50,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2E8B57',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: '#2E8B57',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E8B57',
  },
  roleButtonTextActive: {
    color: '#FFFFFF',
  },
  registerButton: {
    backgroundColor: '#2E8B57',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  registerButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#2E8B57',
    fontWeight: '600',
  },
})