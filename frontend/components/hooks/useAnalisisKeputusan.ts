import { Alert } from 'react-native';
import { useAnalisis } from './useAnalisis';
import { useKeputusan } from './useKeputusan';
import { AnalisisService } from '../services/analisisService';

export type ActiveTab = 'analisis' | 'keputusan';

export const useAnalisisKeputusan = () => {
  const analisis = useAnalisis();
  const keputusan = useKeputusan();

  const handleBuatKeputusan = () => {
    if (!analisis.hasil) {
      Alert.alert("Peringatan", "Hasil analisis belum tersedia");
      return;
    }
    
    keputusan.openKeputusanModal(analisis.hasil.rekomendasi_penanganan || '');
  };

  const submitKeputusanDariAnalisis = () => {
    if (!analisis.hasil) {
      Alert.alert("Peringatan", "Hasil analisis tidak tersedia");
      return;
    }

    return keputusan.submitKeputusan(analisis.hasil.analisis_id);
  };

  return {
    ...analisis,
    ...keputusan,
    
    // Override actions khusus
    handleBuatKeputusan,
    submitKeputusan: submitKeputusanDariAnalisis,
    
    // Combined stats
    stats: AnalisisService.calculateStats(analisis.laporanList, keputusan.keputusanList),
  };
};