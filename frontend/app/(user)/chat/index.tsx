import React, { useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert 
} from "react-native";
import { useChat } from '@/components/hooks/useChat';
import { MessageBubble } from '@/components/role/user/chat/MessageBubble';
import { TypingIndicator } from '@/components/role/user/chat/TypingIndicator';
import { ChatEmptyState } from '@/components/role/user/chat/ChatEmptyState';

export default function ChatAiScreen() {
  const {
    pertanyaan,
    messages,
    loading,
    error,
    setPertanyaan,
    handleKirim,
    validateQuestion,
    formatTime,
    clearError,
  } = useChat();

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [
        { text: "OK", onPress: clearError }
      ]);
    }
  }, [error, clearError]);

  const isQuestionValid = validateQuestion(pertanyaan);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat AI Mangrove 🌱</Text>
        <Text style={styles.headerSubtitle}>
          Tanya seputar ekosistem mangrove
        </Text>
      </View>

      {/* Area Chat */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <ChatEmptyState />
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              formatTime={formatTime}
            />
          ))
        )}

        {loading && <TypingIndicator />}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Ketik pertanyaan Anda..."
            value={pertanyaan}
            onChangeText={setPertanyaan}
            multiline
            maxLength={500}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            onPress={handleKirim}
            style={[
              styles.sendButton,
              (!isQuestionValid || loading) && styles.sendButtonDisabled
            ]}
            disabled={!isQuestionValid || loading}
          >
            <Text style={styles.sendButtonText}>
              {loading ? "⏳" : "➤"}
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.charCount}>
          {pertanyaan.length}/500 karakter
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
    backgroundColor: "#228B22",
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    marginTop: 4,
    opacity: 0.9,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#228B22",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
});