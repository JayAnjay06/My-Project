import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
  Image
} from "react-native";
import { useChat } from '@/components/hooks/useChat';
import { MessageBubble } from '@/components/role/user/chat/MessageBubble';
import { TypingIndicator } from '@/components/role/user/chat/TypingIndicator';
import { ChatEmptyState } from '@/components/role/user/chat/ChatEmptyState';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A7B79" />

      {/*Header*/}
      <LinearGradient
        colors={['#0A7B79', '#0D9488', '#14B8A6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.icon} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Mangrove AI Assistant</Text>
            <Text style={styles.headerSubtitle}>
              Tanya seputar ekosistem mangrove 🌱
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Chat Area */}
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
        style={styles.chatBackground}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatContent}
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
      </LinearGradient>

      {/* Input Area */}
      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Tanya tentang mangrove..."
              value={pertanyaan}
              onChangeText={setPertanyaan}
              multiline
              maxLength={500}
              placeholderTextColor="#94A3B8"
              textAlignVertical="center"
            />

            {/* Character Counter */}
            {pertanyaan.length > 0 && (
              <View style={styles.charCounter}>
                <Text style={styles.charCount}>
                  {pertanyaan.length}/500
                </Text>
              </View>
            )}
          </View>

          {/* Send Button */}
          <TouchableOpacity
            onPress={handleKirim}
            style={[
              styles.sendButton,
              (!isQuestionValid || loading) && styles.sendButtonDisabled
            ]}
            disabled={!isQuestionValid || loading}
          >
            <LinearGradient
              colors={isQuestionValid && !loading ? ['#0EA5E9', '#0284C7'] : ['#CBD5E1', '#94A3B8']}
              style={styles.sendButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color="white" />
                  <Text style={styles.sendButtonText}>Processing</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Ionicons name="send" size={18} color="white" />
                  <Text style={styles.sendButtonText}>Send</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 24,
    backgroundColor: '#ffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    width: 60,
    height: 60,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 2,
    fontWeight: '500',
  },
  chatBackground: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    minHeight: '100%',
  },
  inputSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    minHeight: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'relative',
  },
  textInput: {
    flex: 1,
    fontSize: 11,
    color: '#1E293B',
    maxHeight: 100,
    paddingRight: 50,
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: 20,
  },
  charCounter: {
    position: 'absolute',
    right: 12,
    bottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  charCount: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  sendButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 80,
    height: 56,
  },
  sendButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  sendButtonDisabled: {
    shadowColor: '#64748B',
    shadowOpacity: 0.2,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});