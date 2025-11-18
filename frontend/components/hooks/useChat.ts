import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, SendMessageData } from '@/components/types/chat';
import { ChatService } from '@/components/services/chatService';

const shouldLog = process.env.NODE_ENV === 'development';

export interface UseChatReturn {
  pertanyaan: string;
  messages: Message[];
  loading: boolean;
  error: string;
  setPertanyaan: (text: string) => void;
  handleKirim: () => Promise<void>;
  validateQuestion: (question: string) => boolean;
  formatTime: (date: Date) => string;
  clearError: () => void;
}

export const useChat = (): UseChatReturn => {
  const [pertanyaan, setPertanyaan] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearError = useCallback(() => setError(""), []);

  const validateQuestion = useCallback((question: string): boolean => {
    const trimmedQuestion = question.trim();
    return trimmedQuestion.length > 0 && trimmedQuestion.length <= 500;
  }, []);

  const handleKirim = useCallback(async (): Promise<void> => {
    if (!validateQuestion(pertanyaan)) {
      setError("Pertanyaan tidak boleh kosong dan maksimal 500 karakter!");
      return;
    }

    setError("");
    setLoading(true);

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
      const messageData: SendMessageData = {
        user_id: null,
        pertanyaan: currentQuestion,
      };

      const result = await ChatService.sendMessage(messageData);

      const aiMessage: Message = {
        id: Date.now() + 1,
        text: result.status === "success" 
          ? result.data.jawaban 
          : "Maaf, AI tidak merespon.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
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
  }, [pertanyaan, validateQuestion]);

  const formatTime = useCallback((date: Date): string => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }, []);

  return {
    pertanyaan,
    messages,
    loading,
    error,
    setPertanyaan,
    handleKirim,
    validateQuestion,
    formatTime,
    clearError,
  };
};