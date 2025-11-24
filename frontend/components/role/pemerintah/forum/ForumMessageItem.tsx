// components/ForumMessageItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { ForumMessage, RoleInfo } from '@/components/types/forum';

interface ForumMessageItemProps {
  message: ForumMessage;
  profile: { nama_lengkap: string; role: string } | null;
  getRoleInfo: (role?: string, name?: string) => RoleInfo;
  formatTime: (dateString: string) => string;
  onDelete: (forum_id: number) => void;
}

export const ForumMessageItem: React.FC<ForumMessageItemProps> = ({
  message,
  profile,
  getRoleInfo,
  formatTime,
  onDelete,
}) => {
  const roleInfo = getRoleInfo(
    message.user?.role,
    message.user?.nama_lengkap ?? message.guest_name ?? ""
  );

  const isOwnMessage = message.user?.nama_lengkap === profile?.nama_lengkap;

  const handleDeletePress = () => {
    Alert.alert(
      "Konfirmasi Hapus",
      "Apakah Anda yakin ingin menghapus pesan ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => onDelete(message.forum_id),
        },
      ]
    );
  };

  return (
    <View style={[
      styles.messageContainer,
      isOwnMessage && styles.ownMessageContainer
    ]}>
      <View style={styles.messageHeader}>
        <View style={[styles.roleBadge, { backgroundColor: roleInfo.roleLabel }]}>
          <Ionicons name={roleInfo.icon} size={12} color={roleInfo.color} />
          <Text style={[styles.senderName, { color: roleInfo.color }]}>
            {roleInfo.label}
          </Text>
        </View>
        <Text style={styles.timeText}>{formatTime(message.created_at)}</Text>
      </View>
      
      <Text style={styles.messageText}>{message.isi_pesan}</Text>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeletePress}
      >
        <Ionicons name="trash-outline" size={16} color="#F44336" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#e0e0e0",
  },
  ownMessageContainer: {
    borderLeftColor: "#2196F3",
    backgroundColor: "#f0f7ff",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  timeText: {
    fontSize: 11,
    color: "#999",
    position: 'absolute',
    top: 0,
    right: 20
  },
  messageText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4,
  },
});