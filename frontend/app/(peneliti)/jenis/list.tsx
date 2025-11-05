import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { API_IMAGE, API_URL } from "@/components/api/api";
import { Jenis, FormState } from "@/components/types/jenis";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onSelectForm: (mode: "create" | "edit", form?: FormState) => void;
};

export default function JenisList({ onSelectForm }: Props) {
  const [jenisList, setJenisList] = useState<Jenis[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJenis = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/jenis`);
      const data = await res.json();
      setJenisList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJenis();
  }, []);

  const truncateText = (text: string, maxLength: number) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const renderItem = ({ item }: { item: Jenis }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        onSelectForm("edit", {
          jenis_id: item.jenis_id,
          nama_ilmiah: item.nama_ilmiah,
          nama_lokal: item.nama_lokal,
          deskripsi: item.deskripsi,
          gambar: null,
        })
      }
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Memuat data jenis mangrove...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Katalog Jenis Mangrove</Text>
          <Text style={styles.subtitle}>
            {jenisList.length} jenis mangrove tercatat
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => onSelectForm("create")}
        >
          <Text style={styles.addButtonText}>Tambah Jenis</Text>
        </TouchableOpacity>
      </View>

      {jenisList.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="leaf-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Belum ada data jenis mangrove</Text>
          <Text style={styles.emptySubtitle}>
            Mulai dengan menambahkan jenis mangrove pertama Anda
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => onSelectForm("create")}
          >
            <Text style={styles.emptyButtonText}>Tambah Jenis Pertama</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={jenisList}
          keyExtractor={(item) => item.jenis_id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196F3",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    position:'absolute',
    right:5,
    top:40,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  listContainer: {
    padding: 16,
  },
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
  separator: {
    height: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});