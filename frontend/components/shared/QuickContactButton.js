// components/shared/QuickContactButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const QuickContactButton = ({ 
  listingId, 
  ownerId, 
  listingTitle, 
  listingType = 'property', 
  compact = false
}) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const currentUser = useSelector(state => state.auth.user || state.auth.currentUser);
  
  // Don't show if the current user is the owner
  // Check multiple possible ID formats and fields
  if (
    (currentUser?.id === ownerId) || 
    (currentUser?._id === ownerId) ||
    (currentUser?.id && ownerId && currentUser.id.toString() === ownerId.toString()) ||
    (currentUser?._id && ownerId && currentUser._id.toString() === ownerId.toString())
  ) {
    return null;
  }
  
  // Handle button press
  const handlePress = (e) => {
    // Prevent event bubbling if passed
    if (e) e.stopPropagation();
    
    // Check if user is logged in
    if (!currentUser) {
      navigation.navigate('Login', { 
        returnScreen: 'Messages',
        params: getNavigationParams()
      });
      return;
    }

    if (listingType === 'property' || listingType === 'rent') {
      navigation.navigate('Messages', {
        screen: 'PropertyInquiry',
        params: getNavigationParams()
      });
    } else if (listingType === 'event') {
      navigation.navigate('Messages', {
        screen: 'EventInquiry',
        params: getNavigationParams()
      });
    } else {
      navigation.navigate('Messages', {
        screen: 'Conversation',
        params: getNavigationParams()
      });
    }
  };
  
  // Determine which screen to navigate to
  const getNavigationScreen = () => {
    if (listingType === 'property' || listingType === 'rent') {
      return 'Messages';
    } else if (listingType === 'event') {
      return 'Messages';
    } else {
      return 'Messages';
    }
  };
  
  // Build navigation parameters
  const getNavigationParams = () => {
    // Get current user ID in consistent format
    const currentUserId = currentUser?.id || currentUser?._id || 'guest';
    
    if (listingType === 'property' || listingType === 'rent') {
      return {
        propertyId: listingId,
        ownerId: ownerId,
        propertyTitle: listingTitle
      };
    } else if (listingType === 'event') {
      return {
        eventId: listingId,
        ownerId: ownerId,
        eventTitle: listingTitle
      };
    } else {
      return {
        conversationId: `${listingType}_${listingId}_${ownerId}_${currentUserId}`,
        title: listingTitle
      };
    }
  };
  
  if (compact) {
    // Compact version for cards
    return (
      <TouchableOpacity
        style={styles.compactButton}
        onPress={handlePress}
      >
        <Ionicons name="chatbubble-outline" size={16} color="#5eaaa8" />
        <Text style={styles.compactButtonText}>
          {t('contact') || 'Contact'}
        </Text>
      </TouchableOpacity>
    );
  }
  
  // Standard version
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
    >
      <Ionicons name="chatbubble-outline" size={18} color="#fff" />
      <Text style={styles.buttonText}>
        {t('message') || 'Message'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5eaaa8',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
  },
  compactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8f8',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  compactButtonText: {
    fontSize: 12,
    color: '#5eaaa8',
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default QuickContactButton;