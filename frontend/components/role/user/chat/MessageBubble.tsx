import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '@/components/types/chat';

interface MessageBubbleProps {
  message: Message;
  formatTime: (date: Date) => string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  formatTime,
}) => {
  return (
    <View
      style={[
        styles.messageBubble,
        message.isUser ? styles.userBubble : styles.aiBubble,
      ]}
    >
      <View style={styles.messageHeader}>
        <Text style={[
          styles.senderName,
          message.isUser ? styles.userName : styles.aiName
        ]}>
          {message.isUser ? "Anda" : "AI Mangrove"}
        </Text>
        <Text style={styles.timestamp}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
      <Text style={[
        styles.messageText,
        message.isUser ? styles.userMessageText : styles.aiMessageText
      ]}>
        {message.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 16,
    maxWidth: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#228B22",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderBottomLeftRadius: 4,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
  },
  userName: {
    color: "rgba(255,255,255,0.8)",
  },
  aiName: {
    color: "#228B22",
  },
  timestamp: {
    fontSize: 10,
    color: "#999",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: "white",
  },
  aiMessageText: {
    color: "#333",
  },
});