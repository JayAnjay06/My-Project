import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useForumPemerintah } from '@/components/hooks/useForum';
import { ForumMessageItem } from '@/components/role/pemerintah/forum/ForumMessageItem';

export default function ForumPemerintah() {
  const {
    messages,
    isiPesan,
    guestName,
    loading,
    refreshing,
    sending,
    profile,
    error,
    setIsiPesan,
    setGuestName,
    onRefresh,
    handleSend,
    handleDelete,
    getRoleInfo,
    formatTime,
    validateMessage,
    clearError,
  } = useForumPemerintah();

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
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Memuat forum diskusi...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Forum Diskusi Mangrove</Text>
        <Text style={styles.headerSubtitle}>
          Diskusi dan berbagi informasi tentang mangrove
        </Text>
        <View style={styles.profileBadge}>
          <Ionicons name="person-circle" size={16} color="#4CAF50" />
          <Text style={styles.profileText}>{profile?.nama_lengkap}</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item, index) => item.forum_id?.toString() ?? `message-${index}`}
        renderItem={({ item }) => (
          <ForumMessageItem
            message={item}
            profile={profile}
            getRoleInfo={getRoleInfo}
            formatTime={formatTime}
            onDelete={handleDelete}
          />
        )}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2196F3"]}
            tintColor="#2196F3"
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
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  profileBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 8,
    backgroundColor: "#f0f7ff",
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  profileText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 6,
    marginRight: 12,
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
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  inputContainer: {
    padding: 16,
    paddingVertical: 35,
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
    backgroundColor: "#2196F3",
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