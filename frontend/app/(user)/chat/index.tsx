import { API_URL } from "@/components/api/api";
import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet 
} from "react-native";

export default function ChatAiScreen() {
  const [pertanyaan, setPertanyaan] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  // Definisikan tipe untuk messages
  type Message = {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
  };

  // Auto scroll ke bawah ketika ada pesan baru
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleKirim = async () => {
    if (!pertanyaan.trim()) {
      setError("Pertanyaan tidak boleh kosong!");
      return;
    }

    setError("");
    setLoading(true);

    // Tambahkan pesan user ke chat
    const userMessage: Message = {
      id: Date.now(),
      text: pertanyaan,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = pertanyaan;
    setPertanyaan("");

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_id: null,
          pertanyaan: currentQuestion,
        }),
      });

      const result = await response.json();

      // Tambahkan pesan AI ke chat
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: response.ok && result.status === "success" 
          ? result.data.jawaban 
          : result.data?.jawaban || "Maaf, AI tidak merespon.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error("Fetch error:", err);
      
      // Tambahkan pesan error ke chat
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Maaf, terjadi kesalahan. Pastikan koneksi internet Anda stabil dan backend berjalan.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setError("Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

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
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
              Selamat Datang! 👋
            </Text>
            <Text style={styles.emptyStateText}>
              Saya adalah asisten AI untuk informasi mangrove. 
              Silakan tanyakan apa saja tentang ekosistem mangrove!
            </Text>
            <View style={styles.suggestionContainer}>
              <Text style={styles.suggestionTitle}>Contoh pertanyaan:</Text>
              <Text style={styles.suggestion}>• Apa manfaat ekosistem mangrove?</Text>
              <Text style={styles.suggestion}>• Bagaimana cara menanam mangrove?</Text>
              <Text style={styles.suggestion}>• Jenis-jenis mangrove apa saja?</Text>
            </View>
          </View>
        ) : (
          messages.map((message) => (
            <View
              key={message.id}
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
          ))
        )}

        {loading && (
          <View style={[styles.messageBubble, styles.aiBubble]}>
            <View style={styles.messageHeader}>
              <Text style={[styles.senderName, styles.aiName]}>
                AI Mangrove
              </Text>
            </View>
            <View style={styles.typingIndicator}>
              <ActivityIndicator size="small" color="#228B22" />
              <Text style={styles.typingText}>AI sedang mengetik...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
        
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Ketik pertanyaan Anda..."
            value={pertanyaan}
            onChangeText={setPertanyaan}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={handleKirim}
            style={[
              styles.sendButton,
              (!pertanyaan.trim() || loading) && styles.sendButtonDisabled
            ]}
            disabled={!pertanyaan.trim() || loading}
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
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  suggestionContainer: {
    backgroundColor: "#e8f5e8",
    padding: 16,
    borderRadius: 12,
    width: "100%",
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#228B22",
    marginBottom: 8,
  },
  suggestion: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
  },
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
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
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
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
});