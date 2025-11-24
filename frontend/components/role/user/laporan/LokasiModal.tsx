import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Lokasi } from '@/components/types/laporan';

interface LokasiModalProps {
  visible: boolean;
  lokasiList: Lokasi[];
  loading: boolean;
  onClose: () => void;
  onSelectLokasi: (lokasi: Lokasi) => void;
}

export const LokasiModal: React.FC<LokasiModalProps> = ({
  visible,
  lokasiList,
  loading,
  onClose,
  onSelectLokasi,
}) => {
  const renderLokasiItem = ({ item }: { item: Lokasi }) => (
    <TouchableOpacity
      style={styles.lokasiItem}
      onPress={() => onSelectLokasi(item)}
    >
      <Text style={styles.lokasiName}>{item.nama_lokasi}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Pilih Lokasi</Text>
          <TouchableOpacity 
            onPress={onClose}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Memuat daftar lokasi...</Text>
          </View>
        ) : (
          <FlatList
            data={lokasiList}
            renderItem={renderLokasiItem}
            keyExtractor={(item) => item.lokasi_id.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  lokasiItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  lokasiName: {
    fontSize: 16,
    color: "#333",
  },
});