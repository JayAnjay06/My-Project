// import { FormState, Jenis, JenisFormData, JenisStats } from '@/components/types/jenis';
// import { API_URL } from '@/components/api/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export class JenisService {
//   static async fetchJenis(): Promise<Jenis[]> {
//     try {
//       const response = await fetch(`${API_URL}/jenis`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching jenis:', error);
//       throw new Error('Gagal memuat data jenis mangrove');
//     }
//   }

//   static async fetchJenisById(id: number): Promise<Jenis> {
//     try {
//       const response = await fetch(`${API_URL}/jenis/${id}`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching jenis by id:', error);
//       throw new Error('Gagal memuat detail jenis mangrove');
//     }
//   }
// }

// // pemerintah
// export class JenisServicePh {
//   static async fetchJenis(): Promise<Jenis[]> {
//     try {
//       console.log('Fetching jenis from:', `${API_URL}/jenis`);
//       const response = await fetch(`${API_URL}/jenis`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//       });
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Server response error:', {
//           status: response.status,
//           statusText: response.statusText,
//           error: errorText
//         });
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
      
//       const data = await response.json();
//       console.log('Jenis fetched successfully:', data.length);
//       return data;
//     } catch (error) {
//       console.error('Error fetching jenis:', error);
//       throw new Error('Gagal memuat data jenis mangrove. Periksa koneksi internet Anda.');
//     }
//   }

//   static calculateStats(jenisList: Jenis[]): JenisStats {
//     return {
//       totalJenis: jenisList.length,
//     };
//   }
// }
 
// //peneliti
// export class JenisServiceP2 {
//   static async fetchJenis(): Promise<Jenis[]> {
//     try {
//       console.log('Fetching jenis from:', `${API_URL}/jenis`);
//       const response = await fetch(`${API_URL}/jenis`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//       });
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Server response error:', {
//           status: response.status,
//           statusText: response.statusText,
//           error: errorText
//         });
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
      
//       const data = await response.json();
//       console.log('Jenis fetched successfully:', data.length);
//       return data;
//     } catch (error) {
//       console.error('Error fetching jenis:', error);
//       throw new Error('Gagal memuat data jenis mangrove. Periksa koneksi internet Anda.');
//     }
//   }

//   // Add method to format Jenis to FormState
//   static formatJenisToFormState(jenis: Jenis): FormState {
//     return {
//       jenis_id: jenis.jenis_id,
//       nama_ilmiah: jenis.nama_ilmiah,
//       nama_lokal: jenis.nama_lokal,
//       deskripsi: jenis.deskripsi,
//       gambar: null, // Don't load existing image as file object
//     };
//   }

//   // Add method to create new empty FormState
//   static createEmptyFormState(): FormState {
//     return {
//       jenis_id: null,
//       nama_ilmiah: "",
//       nama_lokal: "",
//       deskripsi: "",
//       gambar: null,
//     };
//   }
// }

// // services/jenisService.ts - UPDATE
 
// export class JenisServiceP21 {
//   static async createJenis(formData: JenisFormData): Promise<void> {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const data = this.createFormData(formData);
      
//       const response = await fetch(`${API_URL}/jenis`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: data,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
//       }
//     } catch (error) {
//       console.error('Error creating jenis:', error);
//       throw error;
//     }
//   }

//   static async updateJenis(id: number, formData: JenisFormData): Promise<void> {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const data = this.createFormData(formData);
//       data.append('_method', 'PUT');
      
//       const response = await fetch(`${API_URL}/jenis/${id}`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: data,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
//       }
//     } catch (error) {
//       console.error('Error updating jenis:', error);
//       throw error;
//     }
//   }

//   static async deleteJenis(id: number): Promise<void> {
//     try {
//       const token = await AsyncStorage.getItem("token");
      
//       const response = await fetch(`${API_URL}/jenis/${id}`, {
//         method: "DELETE",
//         headers: { 
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
//       }
//     } catch (error) {
//       console.error('Error deleting jenis:', error);
//       throw error;
//     }
//   }

//   private static createFormData(formData: JenisFormData): FormData {
//     const data = new FormData();
    
//     data.append("nama_ilmiah", formData.nama_ilmiah);
//     data.append("nama_lokal", formData.nama_lokal);
//     data.append("deskripsi", formData.deskripsi || "");

//     if (formData.gambar && formData.gambar.uri) {
//       const uriParts = formData.gambar.uri.split(".");
//       const fileType = uriParts[uriParts.length - 1];
      
//       data.append("gambar", {
//         uri: formData.gambar.uri,
//         name: `mangrove_${Date.now()}.${fileType}`,
//         type: `image/${fileType}`,
//       } as any);
//     }

//     return data;
//   }

//   // Convert FormState to JenisFormData
//   static convertToFormData(form: FormState): JenisFormData {
//     return {
//       nama_ilmiah: form.nama_ilmiah,
//       nama_lokal: form.nama_lokal,
//       deskripsi: form.deskripsi,
//       gambar: form.gambar || undefined,
//     };
//   }
