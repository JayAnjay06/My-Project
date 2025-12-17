import * as Location from "expo-location";

export class LocationService {
  static async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Izin lokasi ditolak");
      }

      const location = await Location.getCurrentPositionAsync({});
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      throw new Error("Gagal mengambil lokasi saat ini");
    }
  }

  static formatCoordinates(latitude: number, longitude: number): string {
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
}