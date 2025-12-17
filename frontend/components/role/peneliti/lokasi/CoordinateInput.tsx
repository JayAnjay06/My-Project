import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

interface CoordinateInputProps {
  label: string;
  value: string;
  onCoordinateChange: (text: string) => void;
  onGetLocation: () => void;
  required?: boolean;
  isLoading?: boolean;
  editable?: boolean;
}

export const CoordinateInput: React.FC<CoordinateInputProps> = ({
  label,
  value,
  onCoordinateChange,
  onGetLocation,
  required = false,
  isLoading = false,
  editable = true,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={styles.coordinateContainer}>
        <TextInput
          value={value}
          onChangeText={onCoordinateChange}
          style={[styles.input, styles.coordinateInput]}
          placeholder="Contoh: -6.123456, 106.123456"
          placeholderTextColor="#999"
          editable={editable && !isLoading}
        />
        <TouchableOpacity
          style={[styles.locationButton, isLoading && styles.buttonDisabled]}
          onPress={onGetLocation}
          disabled={isLoading || !editable}
        >
          <Ionicons name="location" size={20} color="#fff" />
          <Text style={styles.locationButtonText}>Lokasi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#F44336",
  },
  coordinateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  coordinateInput: {
    flex: 1,
    marginRight: 8,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    justifyContent: "center",
  },
  locationButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});