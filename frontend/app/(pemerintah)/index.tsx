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

export default function Pemerintah() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLokasi: 0,
    totalLaporan: 0,
    laporanPending: 0,
    forumAktif: 0
  });

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const profileRes = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = await profileRes.json();
      setProfile(profileData);

      const [lokasiRes, laporanRes, forumRes] = await Promise.all([
        fetch(`${API_URL}/lokasi`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/laporan`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/forum`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      const lokasiData = await lokasiRes.json();
      const laporanData = await laporanRes.json();
      const forumData = await forumRes.json();

      const lokasiList = lokasiData.data || lokasiData || [];
      const laporanList = laporanData.data || laporanData || [];
      const forumList = forumData.data || forumData || [];

      setStats({
        totalLokasi: lokasiList.length,
        totalLaporan: laporanList.length,
        laporanPending: laporanList.filter((l: any) => l.status === 'pending').length,
        forumAktif: forumList.filter((f: any) => {
          const lastPost = new Date(f.updated_at || f.created_at);
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return lastPost > sevenDaysAgo;
        }).length
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
      title: 'Daftar Lokasi',
      icon: 'map-outline',
      color: '#2196F3',
      route: '/(pemerintah)/lokasi',
      description: 'Kelola data lokasi penanaman'
    },
    {
      title: 'Daftar Jenis Mangrove',
      icon: 'leaf-outline',
      color: '#4CAF50',
      route: '/(pemerintah)/jenis',
      description: 'Kelola jenis tanaman'
    },
    {
      title: 'Laporan Masuk',
      icon: 'document-text-outline',
      color: '#FF9800',
      route: '/(pemerintah)/laporan',
      description: 'Review laporan masyarakat'
    },
    {
      title: 'Forum Edukatif',
      icon: 'chatbubbles-outline',
      color: '#9C27B0',
      route: '/(pemerintah)/forum',
      description: 'Kelola forum diskusi'
    },
    {
      title: 'Registrasi User',
      icon: 'person-add-outline',
      color: '#795548',
      route: '/(auth)/register',
      description: 'Daftarkan user baru'
    },
    {
      title: 'Analisis AI',
      icon: 'analytics-outline',
      color: '#607D8B',
      route: '/(pemerintah)/analisis',
      description: 'Analisis data monitoring'
    },
  ];

  const priorityItems = [
    {
      title: 'Laporan Perlu Review',
      count: stats.laporanPending,
      icon: 'warning-outline',
      color: '#F44336',
      route: '/(pemerintah)/laporan'
    },
    {
      title: 'Lokasi Monitoring',
      count: stats.totalLokasi,
      icon: 'location-outline',
      color: '#2196F3',
      route: '/(pemerintah)/lokasi'
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Memuat dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>Selamat Datang</Text>
            <Text style={styles.name}>{profile?.nama_lengkap}</Text>
            <Text style={styles.role}>{profile?.role}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistik</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalLokasi}</Text>
              <Text style={styles.statLabel}>Total Lokasi</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalLaporan}</Text>
              <Text style={styles.statLabel}>Total Laporan</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.laporanPending}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </View>

        {/* Main Menu */}
        <View style={styles.menuSection}>
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
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </TouchableOpacity>
            ))}
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
    position:"absolute",
    top:75,
    right:20
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  statsSection: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: 'white',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  menuSection: {
    marginBottom: 20,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  menuTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
    textAlign: 'center',
  },
  menuDescription: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    lineHeight: 14,
  },
});