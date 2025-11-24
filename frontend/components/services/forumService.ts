import { API_URL } from '@/components/api/api';
import { ForumMessage, SendMessageData, UserProfile } from '@/components/types/forum';

export class ForumService {
  static fetchProfile(token: any) {
    throw new Error('Method not implemented.');
  }
  static deleteMessage(forum_id: number, token: any) {
    throw new Error('Method not implemented.');
  }
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

//pemerintah
export class ForumServicePh {
  static async fetchMessages(token: string): Promise<ForumMessage[]> {
    try {
      const response = await fetch(`${API_URL}/forum`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching forum messages:', error);
      throw new Error('Gagal memuat pesan forum. Periksa koneksi internet Anda.');
    }
  }

  static async fetchProfile(token: string): Promise<UserProfile> {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new Error('Gagal memuat profil pengguna.');
    }
  }

  static async sendMessage(messageData: SendMessageData, token: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/forum`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('Server error details:', errorData);
        } catch (parseError) {
          const errorText = await response.text();
          console.error('Server error text:', errorText);
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          throw new Error('Gagal mengirim pesan. Periksa koneksi internet Anda.');
        } else if (error.message.includes('401')) {
          throw new Error('Sesi telah berakhir. Silakan login kembali.');
        } else if (error.message.includes('500')) {
          throw new Error('Server sedang mengalami masalah. Silakan coba lagi nanti.');
        }
      }
      
      throw new Error('Gagal mengirim pesan. Silakan coba lagi.');
    }
  }

  static async deleteMessage(forum_id: number, token: string): Promise<void> {
    try {      
      const response = await fetch(`${API_URL}/forum/${forum_id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('Server error details:', errorData);
        } catch (parseError) {
          const errorText = await response.text();
          console.error('Server error text:', errorText);
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

    } catch (error) {
      console.error('Error deleting message:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          throw new Error('Gagal menghapus pesan. Periksa koneksi internet Anda.');
        } else if (error.message.includes('401')) {
          throw new Error('Sesi telah berakhir. Silakan login kembali.');
        } else if (error.message.includes('403')) {
          throw new Error('Anda tidak memiliki izin untuk menghapus pesan ini.');
        } else if (error.message.includes('500')) {
          throw new Error('Server sedang mengalami masalah. Silakan coba lagi nanti.');
        }
      }
      
      throw new Error('Gagal menghapus pesan. Silakan coba lagi.');
    }
  }
}