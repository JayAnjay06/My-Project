import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { ForumMessage, RoleInfo } from '@/components/types/forum';

interface MessageItemProps {
  message: ForumMessage;
  guestName: string;
  getRoleInfo: (role?: string, name?: string) => RoleInfo;
  formatTime: (dateString: string) => string;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  guestName,
  getRoleInfo,
  formatTime,
}) => {
  const roleInfo = getRoleInfo(
    message.user?.role,
    message.user?.nama_lengkap ?? message.guest_name ?? "Anonim"
  );

  const isOwnMessage = message.guest_name === guestName;

  return (
    <View style={[
      styles.messageContainer,
      isOwnMessage && styles.ownMessageContainer
    ]}>
      <View style={styles.messageHeader}>
        <View style={styles.roleContainer}>
          <Ionicons name={roleInfo.icon} size={12} color={roleInfo.color} />
          <Text style={[styles.senderName, { color: roleInfo.color }]}>
            {roleInfo.label}
          </Text>
          {roleInfo.roleLabel !== "Masyarakat" && (
            <Text style={[styles.roleLabel, { color: roleInfo.color }]}>
              • {roleInfo.roleLabel}
            </Text>
          )}
        </View>
        <Text style={styles.timeText}>{formatTime(message.created_at)}</Text>
      </View>
      
      <Text style={styles.messageText}>{message.isi_pesan}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ownMessageContainer: {
    backgroundColor: "#f0f9f0",
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  roleLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginLeft: 4,
  },
  timeText: {
    fontSize: 11,
    color: "#999",
  },
  messageText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});