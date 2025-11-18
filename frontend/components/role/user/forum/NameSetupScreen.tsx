import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

interface NameSetupScreenProps {
  guestName: string;
  setGuestName: (name: string) => void;
  onSaveName: () => void;
  validateName: (name: string) => boolean;
}

export const NameSetupScreen: React.FC<NameSetupScreenProps> = ({
  guestName,
  setGuestName,
  onSaveName,
  validateName,
}) => {
  const isNameValid = validateName(guestName);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="people" size={48} color="#4CAF50" />
        <Text style={styles.title}>Selamat Datang di Forum</Text>
        <Text style={styles.subtitle}>
          Masukkan nama Anda untuk mulai berdiskusi
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nama Anda</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Budi Santoso"
          value={guestName}
          onChangeText={setGuestName}
          maxLength={30}
          autoFocus
        />
        <Text style={styles.helper}>
          Nama ini akan ditampilkan di forum dan tidak bisa diubah
        </Text>

        <TouchableOpacity 
          style={[
            styles.button,
            !isNameValid && styles.buttonDisabled
          ]} 
          onPress={onSaveName}
          disabled={!isNameValid}
        >
          <Text style={styles.buttonText}>Mulai Berdiskusi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fafafa",
    marginBottom: 8,
  },
  helper: {
    fontSize: 12,
    color: "#666",
    marginBottom: 24,
    lineHeight: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});