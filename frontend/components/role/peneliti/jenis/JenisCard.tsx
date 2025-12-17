import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Jenis } from '@/components/types/jenis';
import { API_IMAGE } from '@/components/api/api';

interface JenisCardProps {
  item: Jenis;
  onPress: () => void;
  truncateText: (text: string, maxLength: number) => string;
}

export const JenisCard: React.FC<JenisCardProps> = ({
  item,
  onPress,
  truncateText,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {item.gambar ? (
          <Image
            source={{ uri: `${API_IMAGE}/storage/${item.gambar}` }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Ionicons name="leaf" size={40} color="#4CAF50" />
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.namaLokal} numberOfLines={1}>
              {item.nama_lokal}
            </Text>
            <View style={styles.editIcon}>
              <Ionicons name="create-outline" size={16} color="#666" />
            </View>
          </View>
          
          <Text style={styles.namaIlmiah} numberOfLines={1}>
            {item.nama_ilmiah}
          </Text>
          
          {item.deskripsi && (
            <Text style={styles.deskripsi} numberOfLines={2}>
              {truncateText(item.deskripsi, 80)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    padding: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholderImage: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
  },
  textContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  namaLokal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
    flex: 1,
    marginRight: 8,
  },
  editIcon: {
    padding: 4,
  },
  namaIlmiah: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#4CAF50",
    marginBottom: 6,
  },
  deskripsi: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 8,
  },
});