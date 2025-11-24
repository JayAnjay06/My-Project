import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Laporan } from '@/components/types/laporan';

interface LaporanCardProps {
    item: Laporan;
    onPress?: () => void;
    getStatusColor: (status: string) => string;
    getStatusIcon: (status: string) => string;
    getStatusLabel: (status: string) => string;
    formatDate: (dateString: string) => string;
    truncateText: (text: string, maxLength: number) => string;
}

export const LaporanCard: React.FC<LaporanCardProps> = ({
    item,
    onPress,
    getStatusColor,
    getStatusIcon,
    getStatusLabel,
    formatDate,
    truncateText,
}) => {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.statusContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Ionicons name={getStatusIcon(item.status) as any} size={12} color="white" />
                        <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
                    </View>
                </View>
                <Text style={styles.jenisLaporan}>{item.jenis_laporan}</Text>
            </View>

            <View style={styles.cardBody}>
                <Text style={styles.isiLaporan} numberOfLines={2}>
                    {truncateText(item.isi_laporan, 80)}
                </Text>

                <View style={styles.metaInfo}>
                    <View style={styles.metaItem}>
                        <Ionicons name="location" size={12} color="#666" />
                        <Text style={styles.metaText}>
                            {item.lokasi?.nama_lokasi || "Lokasi tidak tersedia"}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.footerInfo}>
                    <Ionicons name="calendar" size={12} color="#666" />
                    <Text style={styles.dateText}>
                        {formatDate(item.tanggal_laporan)}
                    </Text>
                </View>
                <View style={styles.arrowContainer}>
                    <Ionicons name="chevron-forward" size={16} color="#999" />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
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
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    statusContainer: {
        flex: 1,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    statusText: {
        color: "white",
        fontSize: 10,
        fontWeight: "600",
        marginLeft: 4,
    },
    jenisLaporan: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2E7D32",
        textAlign: 'right',
        flex: 1,
        marginLeft: 8,
    },
    cardBody: {
        marginBottom: 12,
    },
    isiLaporan: {
        fontSize: 14,
        color: "#333",
        lineHeight: 20,
        marginBottom: 8,
    },
    metaInfo: {
        marginBottom: 8,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    metaText: {
        fontSize: 12,
        color: "#666",
        marginLeft: 4,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
        paddingTop: 8,
    },
    footerInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    dateText: {
        fontSize: 11,
        color: "#666",
        marginLeft: 4,
    },
    arrowContainer: {
        padding: 4,
    },
});