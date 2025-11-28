import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useForum } from '@/components/hooks/useForum';
import { MessageItem } from '@/components/role/user/forum/MessageItem';
import { NameSetupScreen } from '@/components/role/user/forum/NameSetupScreen';

export default function ForumScreen() {
  const {
    messages,
    isiPesan,
    guestName,
    loading,
    sending,
    refreshing,
    isNameSet,
    error,
    setIsiPesan,
    onRefresh,
    handleSaveName,
    handleSend,
    getRoleInfo,
    formatTime,
    validateMessage,
    validateName,
    clearError,
  } = useForum();

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [
        { text: "OK", onPress: clearError }
      ]);
    }
  }, [error, clearError]);

  const isMessageValid = validateMessage(isiPesan);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Memuat forum...</Text>
      </View>
    );
  }

  if (!isNameSet) {
    return (
      <NameSetupScreen
        guestName={guestName}
        setGuestName={(name) => { }}
        onSaveName={handleSaveName}
        validateName={validateName}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Forum Diskusi Mangrove</Text>
        <Text style={styles.headerSubtitle}>
          Diskusi bersama masyarakat, peneliti, dan pemerintah
        </Text>
        <View style={styles.userBadge}>
          <Ionicons name="person-circle" size={16} color="#666" />
          <Text style={styles.userName}>{guestName}</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item, index) =>
          item.forum_id?.toString() ?? `message-${index}`
        }
        renderItem={({ item }) => (
          <MessageItem
            message={item}
            guestName={guestName}
            getRoleInfo={getRoleInfo}
            formatTime={formatTime}
          />
        )}
        style={styles.messagesList}
        contentContainerStyle={[
          styles.messagesContent,
          messages.length === 0 && styles.emptyMessagesContent
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4CAF50"]}
            tintColor="#4CAF50"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-ellipses-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Belum ada diskusi</Text>
            <Text style={styles.emptySubtitle}>
              Jadilah yang pertama memulai diskusi
            </Text>
          </View>
        }
      />

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Tulis pesan untuk forum..."
            value={isiPesan}
            onChangeText={setIsiPesan}
            multiline
            maxLength={500}
            editable={!sending}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!isMessageValid || sending) && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={!isMessageValid || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.charCount}>
          {isiPesan.length}/500 karakter
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    lineHeight: 20,
  },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  userName: {
    fontSize: 14,
    color: "#333",
    marginLeft: 6,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyMessagesContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 12,
    maxHeight: 100,
    backgroundColor: "#fafafa",
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
  charCount: {
    fontSize: 11,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
  emptyState: {
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
    lineHeight: 20,
  },
});