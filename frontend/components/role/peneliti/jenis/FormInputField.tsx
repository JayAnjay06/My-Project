import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface FormInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
}

export const FormInputField: React.FC<FormInputFieldProps> = ({
  label,
  value,
  onChangeText,
  required = false,
  placeholder = "",
  multiline = false,
  numberOfLines = 1,
  editable = true,
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
        ]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        editable={editable}
        returnKeyType={multiline ? "default" : "done"}
        blurOnSubmit={!multiline}
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
    height: 120,
    textAlignVertical: "top",
  },
});