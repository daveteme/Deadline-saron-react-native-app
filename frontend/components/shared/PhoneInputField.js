// components/shared/PhoneInputField.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const PhoneInputField = ({ value, onChangeText, required = false, error = null }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{t('phoneNumber')}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={t('enterPhoneNumber')}
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.helperText}>
        {t('phoneNumberHelper') || 'Your phone number will be visible to interested parties'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  required: {
    color: '#ff4d4d',
    marginLeft: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff4d4d',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 14,
    marginTop: 4,
  },
  helperText: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
});

export default PhoneInputField;


