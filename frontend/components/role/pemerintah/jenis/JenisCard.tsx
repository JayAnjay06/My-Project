import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Jenis } from '@/components/types/jenis';
import { API_IMAGE } from '@/components/api/api';

interface JenisCardProps {
  item: Jenis;
  truncateText: (text: string, maxLength: number) => string;
}

export const JenisCard: React.FC<JenisCardProps> = ({ item, truncateText }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {item.gambar ? (
          <Image
            source={{
              uri: `${API_IMAGE}/storage/${item.gambar}`,
            }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Ionicons name="leaf-outline" size={40} color="#4CAF50" />
            <Text style={styles.placeholderText}>Gambar Tidak Tersedia</Text>
          </View>
        )}
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <View style={styles.textContent}>
              <Text style={styles.namaLokal} numberOfLines={1}>
                {item.nama_lokal}
              </Text>
              <Text style={styles.namaIlmiah} numberOfLines={1}>
                {item.nama_ilmiah}
              </Text>
            </View>
          </View>

          {item.deskripsi && (
            <Text style={styles.deskripsi} numberOfLines={3}>
              {truncateText(item.deskripsi, 120)}
            </Text>
          )}

          <View style={styles.footer}>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={14} color="#666" />
              <Text style={styles.infoText}>
                {item.deskripsi ? "Deskripsi tersedia" : "Tidak ada deskripsi"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="image" size={14} color="#666" />
              <Text style={styles.infoText}>
                {item.gambar ? "Gambar tersedia" : "Tidak ada gambar"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'column',
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  placeholderImage: {
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 8,
    textAlign: 'center',
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  textContent: {
    flex: 1,
    marginRight: 12,
  },
  namaLokal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 2,
  },
  namaIlmiah: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#4CAF50',
    marginBottom: 8,
  },
  deskripsi: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 4,
  },
});