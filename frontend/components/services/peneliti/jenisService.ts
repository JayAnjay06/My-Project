import { API_URL } from '@/components/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormState, Jenis, JenisFormData } from '@/components/types/jenis';

// Service untuk view dan form manipulation
export class JenisServicePeneliti {
  static async fetchJenis(): Promise<Jenis[]> {
    try {
      const response = await fetch(`${API_URL}/jenis`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Gagal memuat data jenis mangrove. Periksa koneksi internet Anda.');
    }
  }

  // Format Jenis to FormState
  static formatJenisToFormState(jenis: Jenis): FormState {
    return {
      jenis_id: jenis.jenis_id,
      nama_ilmiah: jenis.nama_ilmiah,
      nama_lokal: jenis.nama_lokal,
      deskripsi: jenis.deskripsi,
      gambar: null, // Don't load existing image as file object
    };
  }

  // Create new empty FormState
  static createEmptyFormState(): FormState {
    return {
      jenis_id: null,
      nama_ilmiah: "",
      nama_lokal: "",
      deskripsi: "",
      gambar: null,
    };
  }
}

// Service untuk CRUD operations dengan authentication
export class JenisServiceCRUD {
  static async createJenis(formData: JenisFormData): Promise<void> {
    try {
      const token = await AsyncStorage.getItem("token");
      const data = this.createFormData(formData);
      
      const response = await fetch(`${API_URL}/jenis`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }

  static async updateJenis(id: number, formData: JenisFormData): Promise<void> {
    try {
      const token = await AsyncStorage.getItem("token");
      const data = this.createFormData(formData);
      data.append('_method', 'PUT');
      
      const response = await fetch(`${API_URL}/jenis/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }

  static async deleteJenis(id: number): Promise<void> {
    try {
      const token = await AsyncStorage.getItem("token");
      
      const response = await fetch(`${API_URL}/jenis/${id}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }

  private static createFormData(formData: JenisFormData): FormData {
    const data = new FormData();
    
    data.append("nama_ilmiah", formData.nama_ilmiah);
    data.append("nama_lokal", formData.nama_lokal);
    data.append("deskripsi", formData.deskripsi || "");

    if (formData.gambar && formData.gambar.uri) {
      const uriParts = formData.gambar.uri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      
      data.append("gambar", {
        uri: formData.gambar.uri,
        name: `mangrove_${Date.now()}.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    return data;
  }

  // Convert FormState to JenisFormData
  static convertToFormData(form: FormState): JenisFormData {
    return {
      nama_ilmiah: form.nama_ilmiah,
      nama_lokal: form.nama_lokal,
      deskripsi: form.deskripsi,
      gambar: form.gambar || undefined,
    };
  }
}