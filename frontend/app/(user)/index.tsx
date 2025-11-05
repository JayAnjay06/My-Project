import { router } from "expo-router";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  StyleSheet 
} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function User() {
  const menuItems = [
    {
      title: 'Lokasi',
      icon: 'location-outline',
      color: '#2196F3',
      route: '/(user)/lokasi',
      description: 'Lihat lokasi penanaman'
    },
    {
      title: 'Jenis Tanaman',
      icon: 'leaf-outline',
      color: '#4CAF50',
      route: '/(user)/jenis',
      description: 'Jenis tanaman tersedia'
    },
    {
      title: 'Laporan',
      icon: 'document-text-outline',
      color: '#FF9800',
      route: '/(user)/laporan',
      description: 'Buat laporan pengaduan'
    },
    {
      title: 'Chat',
      icon: 'chatbubble-outline',
      color: '#9C27B0',
      route: '/(user)/chat',
      description: 'Hubungi peneliti'
    },
    {
      title: 'Forum',
      icon: 'people-outline',
      color: '#795548',
      route: '/(user)/forum',
      description: 'Diskusi masyarakat'
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Selamat Datang Di</Text>
          <Text style={styles.title}>Dashboard Masyarakat</Text>
        </View>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Menu Utama</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuCard}
                onPress={() => router.push(item.route as any)}>
                <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon as any} size={24} color="white" />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informasi</Text>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={24} color="#2196F3" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Aplikasi Monitoring</Text>
              <Text style={styles.infoText}>
                Platform kolaborasi masyarakat dalam monitoring lingkungan
              </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
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
  menuSection: {
    marginBottom: 24,
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
  infoSection: {
    marginBottom: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});