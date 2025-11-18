import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error reading data:', error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  }

  static async setAuthData(token: string, role: string): Promise<void> {
    await Promise.all([
      this.setItem('token', token),
      this.setItem('role', role),
    ]);
  }
}

export class StorageService1 {
  static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  static async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      throw error;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      throw error;
    }
  }

  static async getGuestName(): Promise<string | null> {
    return this.getItem("guestName");
  }

  static async setGuestName(name: string): Promise<void> {
    await this.setItem("guestName", name.trim());
  }

  static async getToken(): Promise<string | null> {
    return this.getItem("token");
  }
}