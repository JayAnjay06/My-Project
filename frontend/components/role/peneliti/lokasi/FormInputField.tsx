import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface FormInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address";
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  error?: boolean;
}

export const FormInputField: React.FC<FormInputFieldProps> = ({
  label,
  value,
  onChangeText,
  required = false,
  placeholder = "",
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  editable = true,
  error = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.input,
          multiline && styles.textArea,
          error && styles.inputError
        ]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        editable={editable}
      />
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#F44336",
  },
});