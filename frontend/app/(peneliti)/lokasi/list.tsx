import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { API_URL } from "@/components/api/api";
import { Lokasi, FormState } from "@/components/types/lokasi";

type Props = {
  onSelectForm: (mode: "create" | "edit", form?: FormState) => void;
};

export default function LokasiList({ onSelectForm }: Props) {
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([]);

  const fetchLokasi = async () => {
    try {
      const res = await fetch(`${API_URL}/lokasi`);
      const data = await res.json();
      setLokasiList(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLokasi();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderItem = ({ item }: { item: Lokasi }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        onSelectForm("edit", {
          lokasi_id: item.lokasi_id,
          nama_lokasi: item.nama_lokasi,
          koordinat: item.koordinat,
          jumlah: item.jumlah?.toString() || "",
          kerapatan: item.kerapatan?.toString() || "",
          tinggi_rata2: item.tinggi_rata2?.toString() || "",
          diameter_rata2: item.diameter_rata2?.toString() || "",
          kondisi: item.kondisi || "",
          luas_area: item.luas_area?.toString() || "",
          deskripsi: item.deskripsi || "",
          tanggal_input: item.tanggal_input ? new Date(item.tanggal_input) : null,
        })
      }
    >
      <View style={styles.cardHeader}>
        <Text style={styles.namaLokasi}>{item.nama_lokasi}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.kondisi) }]}>
          <Text style={styles.statusText}>{item.kondisi || "Belum dinilai"}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Koordinat:</Text>
          <Text style={styles.value}>{item.koordinat}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Jumlah</Text>
            <Text style={styles.statValue}>{item.jumlah || "-"}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Kerapatan</Text>
            <Text style={styles.statValue}>{item.kerapatan ? `${item.kerapatan}/m²` : "-"}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Luas Area</Text>
            <Text style={styles.statValue}>{item.luas_area ? `${item.luas_area} ha` : "-"}</Text>
          </View>
        </View>

        <View style={styles.measurements}>
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Tinggi Rata-rata</Text>
            <Text style={styles.measurementValue}>
              {item.tinggi_rata2 ? `${item.tinggi_rata2} m` : "-"}
            </Text>
          </View>
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Diameter Rata-rata</Text>
            <Text style={styles.measurementValue}>
              {item.diameter_rata2 ? `${item.diameter_rata2} cm` : "-"}
            </Text>
          </View>
        </View>

        {item.deskripsi && (
          <View style={styles.deskripsiContainer}>
            <Text style={styles.label}>Deskripsi:</Text>
            <Text style={styles.deskripsiText} numberOfLines={2}>
              {item.deskripsi}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.dateText}>
            Data dimasukan: {formatDate(item.tanggal_input || "")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (kondisi: string) => {
    switch (kondisi?.toLowerCase()) {
      case "baik":
        return "#4CAF50";
      case "sedang":
        return "#FF9800";
      case "buruk":
        return "#F44336";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daftar Lokasi Penelitian</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => onSelectForm("create")}
        >
          <Text style={styles.addButtonText}>Tambah Lokasi Baru</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Total: {lokasiList.length} lokasi penelitian
      </Text>

      <FlatList
        data={lokasiList}
        keyExtractor={(item) => item.lokasi_id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Belum ada data lokasi penelitian</Text>
            <Text style={styles.emptySubtext}>
              Tekan "Tambah Lokasi Baru" untuk menambahkan data pertama
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
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
    right:1,
    top:33,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  namaLokasi: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  cardBody: {
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  value: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
  },
  measurements: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  measurementItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  measurementLabel: {
    fontSize: 11,
    color: "#1976D2",
    marginBottom: 2,
  },
  measurementValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1976D2",
  },
  deskripsiContainer: {
    marginBottom: 12,
  },
  deskripsiText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginTop: 4,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  dateText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});