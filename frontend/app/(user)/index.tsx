import { View, Text, ScrollView, StyleSheet } from "react-native";
import Header from "@/components/role/user/Header";
import MenuGrid from "@/components/role/user/MenuGrid";
import InfoCard from "@/components/role/user/InfoCard";

export default function User() {
  const menuItems = [
    {
      title: 'Daftar Lokasi',
      icon: 'location-outline',
      color: '#2196F3',
      route: '/(user)/lokasi',
      description: 'Lihat lokasi penanaman'
    },
    {
      title: 'Daftar Jenis Mangrove',
      icon: 'leaf-outline',
      color: '#4CAF50',
      route: '/(user)/jenis',
      description: 'Jenis tanaman tersedia'
    },
    {
      title: 'Pengaduan',
      icon: 'document-text-outline',
      color: '#FF9800',
      route: '/(user)/laporan',
      description: 'Buat laporan pengaduan'
    },
    {
      title: 'Chatbot AI',
      icon: 'chatbubble-outline',
      color: '#9C27B0',
      route: '/(user)/chat',
      description: 'Hubungi peneliti'
    },
    {
      title: 'Forum Edukatif',
      icon: 'people-outline',
      color: '#795548',
      route: '/(user)/forum',
      description: 'Diskusi masyarakat'
    },
  ];

  return (
    <View style={styles.container}>
      <Header 
        greeting="Selamat Datang Di" 
        title="Dashboard Masyarakat" 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <MenuGrid 
          title="Menu Utama" 
          items={menuItems} 
        />
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informasi</Text>
          <InfoCard
            icon="information-circle-outline"
            iconColor="#2196F3"
            title="Aplikasi Monitoring"
            text="Platform kolaborasi masyarakat dalam monitoring lingkungan"
          />
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
  content: {
    flex: 1,
    padding: 16,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
});