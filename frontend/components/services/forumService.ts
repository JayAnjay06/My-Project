// services/forumService.ts
import { ForumMessage, SendMessageData } from '@/components/types/forum';
import { API_URL } from '@/components/api/api';

export class ForumService {
  static async fetchMessages(): Promise<ForumMessage[]> {
    try {
      const response = await fetch(`${API_URL}/forum`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      // Hanya log error untuk debugging, tidak untuk operasi normal
      if (error instanceof Error) {
        throw new Error('Gagal memuat pesan forum. Periksa koneksi internet Anda.');
      }
      throw error;
    }
  }

  static async sendMessage(messageData: SendMessageData, token?: string): Promise<void> {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Accept": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/forum`, {
        method: "POST",
        headers,
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }


    } catch (error) {
      // Hanya log error untuk debugging
      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          throw new Error('Gagal mengirim pesan. Periksa koneksi internet Anda.');
        } else if (error.message.includes('500')) {
          throw new Error('Server sedang mengalami masalah. Silakan coba lagi nanti.');
        } else if (error.message.includes('401')) {
          throw new Error('Sesi telah berakhir. Silakan login kembali.');
        }
      }
      
      throw new Error('Gagal mengirim pesan. Silakan coba lagi.');
    }
  }
}