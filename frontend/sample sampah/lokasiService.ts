// import { FormState, Lokasi, LokasiFormData, LokasiStats } from '@/components/types/lokasi';
// import { API_URL } from '@/components/api/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export class LokasiService {
//   static async fetchLokasi(): Promise<Lokasi[]> {
//     try {
//       const response = await fetch(`${API_URL}/lokasi`);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching lokasi:', error);
//       throw new Error('Gagal memuat data lokasi');
//     }
//   }

//   static async fetchLokasiById(id: number): Promise<Lokasi> {
//     try {
//       const response = await fetch(`${API_URL}/lokasi/${id}`);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching lokasi by id:', error);
//       throw new Error('Gagal memuat detail lokasi');
//     }
//   }

//   static calculateStats(lokasiList: Lokasi[]): LokasiStats {
//     const totalLokasi = lokasiList.length;
//     const lokasiBaik = lokasiList.filter(l => l.kondisi?.toLowerCase() === 'baik').length;
//     const lokasiSedang = lokasiList.filter(l => l.kondisi?.toLowerCase() === 'sedang').length;
//     const lokasiBuruk = lokasiList.filter(l => l.kondisi?.toLowerCase() === 'buruk').length;
//     const totalPohon = lokasiList.reduce((sum, l) => sum + (l.jumlah || 0), 0);
//     const totalLuas = lokasiList.reduce((sum, l) => sum + (l.luas_area || 0), 0);
//     const kondisiBaik = lokasiList.filter(item =>
//       item.kondisi?.toLowerCase() === 'baik'
//     ).length;

//     const kondisiSedang = lokasiList.filter(item =>
//       item.kondisi?.toLowerCase() === 'sedang'
//     ).length;

//     const kondisiBuruk = lokasiList.filter(item =>
//       item.kondisi?.toLowerCase() === 'buruk'
//     ).length;

//     return {
//       totalLokasi,
//       lokasiBaik,
//       lokasiSedang,
//       lokasiBuruk,
//       totalPohon,
//       totalLuas,
//       kondisiBaik,
//       kondisiSedang,
//       kondisiBuruk
//     };
//   }
// }

// //peneliti
// export class LokasiServiceP2 {
//   static async fetchLokasi(): Promise<Lokasi[]> {
//     try {
//       console.log('Fetching lokasi from:', `${API_URL}/lokasi`);
//       const response = await fetch(`${API_URL}/lokasi`, {
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
//       console.log('Lokasi fetched successfully:', data.length);
//       return data;
//     } catch (error) {
//       console.error('Error fetching lokasi:', error);
//       throw new Error('Gagal memuat data lokasi. Periksa koneksi internet Anda.');
//     }
//   }

//   // Add method to format Lokasi to FormState
//   static formatLokasiToFormState(lokasi: Lokasi): FormState {
//     return {
//       lokasi_id: lokasi.lokasi_id,
//       nama_lokasi: lokasi.nama_lokasi,
//       koordinat: lokasi.koordinat,
//       jumlah: lokasi.jumlah?.toString() || "",
//       kerapatan: lokasi.kerapatan?.toString() || "",
//       tinggi_rata2: lokasi.tinggi_rata2?.toString() || "",
//       diameter_rata2: lokasi.diameter_rata2?.toString() || "",
//       kondisi: lokasi.kondisi || "",
//       luas_area: lokasi.luas_area?.toString() || "",
//       deskripsi: lokasi.deskripsi || "",
//       tanggal_input: lokasi.tanggal_input ? new Date(lokasi.tanggal_input) : null,
//     };
//   }

//   // Add method to create new empty FormState
//   static createEmptyFormState(): FormState {
//     return {
//       lokasi_id: null,
//       nama_lokasi: "",
//       koordinat: "",
//       jumlah: "",
//       kerapatan: "",
//       tinggi_rata2: "",
//       diameter_rata2: "",
//       kondisi: "",
//       luas_area: "",
//       deskripsi: "",
//       tanggal_input: null,
//     };
//   }
// }

// //
// export class LokasiServiceP21 {
//   static async createLokasi(formData: LokasiFormData): Promise<void> {
//     try {
//       const token = await AsyncStorage.getItem("token");
      
//       const response = await fetch(`${API_URL}/lokasi`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
//       }
//     } catch (error) {
//       console.error('Error creating lokasi:', error);
//       throw error;
//     }
//   }

//   static async updateLokasi(id: number, formData: LokasiFormData): Promise<void> {
//     try {
//       const token = await AsyncStorage.getItem("token");
      
//       const response = await fetch(`${API_URL}/lokasi/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
//       }
//     } catch (error) {
//       console.error('Error updating lokasi:', error);
//       throw error;
//     }
//   }

//   static async deleteLokasi(id: number): Promise<void> {
//     try {
//       const token = await AsyncStorage.getItem("token");
      
//       const response = await fetch(`${API_URL}/lokasi/${id}`, {
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
//       console.error('Error deleting lokasi:', error);
//       throw error;
//     }
//   }

//   // Convert FormState to LokasiFormData
//   static convertToFormData(form: FormState): LokasiFormData {
//     return {
//       nama_lokasi: form.nama_lokasi,
//       koordinat: form.koordinat,
//       jumlah: form.jumlah ? parseInt(form.jumlah) : null,
//       kerapatan: form.kerapatan ? parseFloat(form.kerapatan) : null,
//       tinggi_rata2: form.tinggi_rata2 ? parseFloat(form.tinggi_rata2) : null,
//       diameter_rata2: form.diameter_rata2 ? parseFloat(form.diameter_rata2) : null,
//       kondisi: form.kondisi || null,
//       luas_area: form.luas_area ? parseFloat(form.luas_area) : null,
//       deskripsi: form.deskripsi || null,
//       tanggal_input: form.tanggal_input
//         ? form.tanggal_input.toISOString().split("T")[0]
//         : null,
//     };
//   }
// }