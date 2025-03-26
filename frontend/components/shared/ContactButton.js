// components/shared/ContactButton.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const ContactButton = ({ phoneNumber, listingTitle }) => {
  const { t } = useTranslation();

  const handleContact = () => {
    // If no phone number is provided, show an alert
    if (!phoneNumber) {
      Alert.alert(
        t('noContactInfo') || 'No Contact Information',
        t('noContactInfoMessage') || 'This listing has no contact information provided.',
        [{ text: t('ok') || 'OK', style: 'default' }]
      );
      return;
    }

    // Show options to call or message
    Alert.alert(
      t('contactOptions') || 'Contact Options',
      t('chooseContactMethod') || 'How would you like to contact?',
      [
        {
          text: t('call') || 'Call',
          onPress: () => {
            const cleanPhoneNumber = phoneNumber.replace(/\s+/g, '');
            const phoneUrl = `tel:${cleanPhoneNumber}`;
            
            Linking.canOpenURL(phoneUrl)
              .then(supported => {
                if (supported) {
                  return Linking.openURL(phoneUrl);
                } else {
                  Alert.alert(
                    t('error') || 'Error',
                    t('callNotSupported') || 'Phone calls are not supported on this device'
                  );
                }
              })
              .catch(error => {
                console.error('Error opening phone app:', error);
                Alert.alert(
                  t('error') || 'Error',
                  t('callFailed') || 'Failed to open phone app'
                );
              });
          },
        },
        {
          text: t('message') || 'Message',
          onPress: () => {
            const cleanPhoneNumber = phoneNumber.replace(/\s+/g, '');
            // Format message body with listing title
            const body = `${t('interestedIn') || 'I am interested in'} ${listingTitle}`;
            
            // SMS URL format differs between iOS and Android
            const smsUrl = Platform.OS === 'ios' 
              ? `sms:${cleanPhoneNumber}&body=${encodeURIComponent(body)}`
              : `sms:${cleanPhoneNumber}?body=${encodeURIComponent(body)}`;
            
            Linking.canOpenURL(smsUrl)
              .then(supported => {
                if (supported) {
                  return Linking.openURL(smsUrl);
                } else {
                  Alert.alert(
                    t('error') || 'Error',
                    t('smsNotSupported') || 'SMS is not supported on this device'
                  );
                }
              })
              .catch(error => {
                console.error('Error opening messaging app:', error);
                Alert.alert(
                  t('error') || 'Error',
                  t('smsFailed') || 'Failed to open messaging app'
                );
              });
          },
        },
        {
          text: t('cancel') || 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={styles.contactButton}
      onPress={handleContact}
    >
      <Ionicons name="call-outline" size={18} color="#fff" />
      <Text style={styles.contactButtonText}>{t('contact') || 'Contact'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5eaaa8',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default ContactButton;