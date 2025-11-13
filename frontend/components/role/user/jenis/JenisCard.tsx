import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Jenis } from '@/components/types/jenis';
import { API_IMAGE } from '@/components/api/api';

interface JenisCardProps {
  item: Jenis;
  isExpanded: boolean;
  onPress: () => void;
  truncateText: (text: string, maxLength: number) => string;
}

export const JenisCard: React.FC<JenisCardProps> = ({
  item,
  isExpanded,
  onPress,
  truncateText,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isExpanded && styles.cardExpanded
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        {item.gambar ? (
          <Image
            source={{
              uri: `${API_IMAGE}/storage/${item.gambar}`,
            }}
            style={styles.image}
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Ionicons name="leaf" size={32} color="#4CAF50" />
            <Text style={styles.placeholderText}>Gambar Tidak Tersedia</Text>
          </View>
        )}
        <View style={styles.headerContent}>
          <View style={styles.textContent}>
            <Text style={styles.namaLokal}>{item.nama_lokal}</Text>
            <Text style={styles.namaIlmiah}>{item.nama_ilmiah}</Text>
          </View>

          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#666"
          />
        </View>
      </View>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <View style={styles.divider} />

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Deskripsi</Text>
            <Text style={styles.deskripsi}>
              {item.deskripsi || "Tidak ada deskripsi yang tersedia untuk jenis mangrove ini."}
            </Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Ionicons name="image" size={16} color="#4CAF50" />
              <Text style={styles.infoText}>
                {item.gambar ? "Gambar tersedia" : "Tidak ada gambar"}
              </Text>
            </View>
          </View>

          <View style={styles.actionSection}>
            <Text style={styles.tapInfo}>
              Tap untuk menutup
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardExpanded: {
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderColor: "#4CAF50",
  },
  cardHeader: {
    flexDirection: "column",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 12,
    alignSelf: "center",
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
    textAlign: "center",
  },
  textContent: {
    flex: 1,
  },
  namaLokal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  namaIlmiah: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#4CAF50",
  },
  expandedContent: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginBottom: 12,
  },
  descriptionSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  deskripsi: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    textAlign: "justify",
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
  },
  actionSection: {
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  tapInfo: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
});