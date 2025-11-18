import { ChatResponse, SendMessageData } from '@/components/types/chat';
import { API_URL } from '@/components/api/api';

export class ChatService {
  static async sendMessage(messageData: SendMessageData): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      
      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          throw new Error('Gagal mengirim pesan. Periksa koneksi internet Anda.');
        } else if (error.message.includes('500')) {
          throw new Error('Server AI sedang mengalami masalah. Silakan coba lagi nanti.');
        }
      }
      
      throw new Error('Gagal menghubungi AI. Silakan coba lagi.');
    }
  }
}