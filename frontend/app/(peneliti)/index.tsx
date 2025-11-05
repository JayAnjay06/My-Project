import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView,
  StyleSheet 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { API_URL } from '@/components/api/api';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Peneliti() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLokasi: 0,
    totalLaporan: 0,
    totalAnalisis: 0
  });

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      // Fetch profile
      const profileRes = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = await profileRes.json();
      setProfile(profileData);

      // Fetch data untuk statistik dari endpoint yang sudah ada
      const [lokasiRes, laporanRes] = await Promise.all([
        fetch(`${API_URL}/lokasi`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/laporan`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      const lokasiData = await lokasiRes.json();
      const laporanData = await laporanRes.json();

      // Hitung statistik manual dari data yang didapat
      const lokasiList = lokasiData.data || lokasiData || [];
      const laporanList = laporanData.data || laporanData || [];

      setStats({
        totalLokasi: lokasiList.length,
        totalLaporan: laporanList.length,
        totalAnalisis: 0 // Default value, bisa disesuaikan
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace('/(auth)/login');
  };

  const menuItems = [
    {
      title: 'Lokasi',
      icon: 'location-outline',
      color: '#2196F3',
      route: '/(peneliti)/lokasi',
      description: 'Kelola data lokasi penelitian'
    },
    {
      title: 'Jenis Tanaman',
      icon: 'leaf-outline',
      color: '#4CAF50',
      route: '/(peneliti)/jenis',
      description: 'Data jenis tanaman'
    },
    {
      title: 'Laporan',
      icon: 'document-text-outline',
      color: '#FF9800',
      route: '/(peneliti)/laporan',
      description: 'Buat dan lihat laporan'
    },
    {
      title: 'Analisis',
      icon: 'analytics-outline',
      color: '#9C27B0',
      route: '/(peneliti)/analisis',
      description: 'Analisis data penelitian'
    },
    {
      title: 'Forum',
      icon: 'chatbubbles-outline',
      color: '#795548',
      route: '/(peneliti)/forum',
      description: 'Diskusi dengan peneliti lain'
    },
  ];

  const quickActions = [
    {
      title: 'Tambah Lokasi',
      icon: 'add-circle-outline',
      color: '#2196F3',
      route: '/(peneliti)/lokasi'
    },
    {
      title: 'Buat Laporan',
      icon: 'create-outline',
      color: '#FF9800',
      route: '/(peneliti)/laporan'
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Memuat profil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>Halo,</Text>
            <Text style={styles.name}>{profile?.nama_lengkap}</Text>
            <Text style={styles.role}>{profile?.role}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalLokasi}</Text>
          <Text style={styles.statLabel}>Lokasi</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalLaporan}</Text>
          <Text style={styles.statLabel}>Laporan</Text>
        </View>
        <View style={styles.statDivider} />
      </View>
      {/* Main Menu */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Menu Utama</Text>
        
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuCard}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon as any} size={24} color="white" />
              </View>
              <Text style={styles.menuCardTitle}>{item.title}</Text>
              <Text style={styles.menuCardDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#2196F3' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Lokasi penelitian ditambahkan</Text>
                <Text style={styles.activityTime}>Hari ini</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#4CAF50' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Data analisis tersedia</Text>
                <Text style={styles.activityTime}>2 hari lalu</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  role: {
    fontSize: 12,
    color: '#2196F3',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    position:'absolute',
    right:20,
    top:75
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
  },
  quickActionsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  menuCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
    textAlign: 'center',
  },
  menuCardDescription: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    lineHeight: 14,
  },
  activitySection: {
    marginBottom: 20,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
});