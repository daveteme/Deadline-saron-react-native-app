// screens/RentDetailsScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactButton from '../components/shared/ContactButton';
import ListingOptionsMenu from '../components/shared/ListingOptionsMenu';
import { baseUrl } from '../shared/baseUrl';

// Helper function to normalize IDs for comparison
const isSameId = (id1, id2) => {
  if (!id1 || !id2) return false;
  return String(id1) === String(id2);
};

const RentDetailsScreen = ({ route, navigation }) => {
  const { id, item: passedItem, category } = route.params;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  // Get current user to check if they own the listing
  const currentUser = useSelector(state => state.auth.currentUser);

  console.log('currentUser', currentUser);


 // Add this debug in RentDetailsScreen.js
useEffect(() => {
  if (property && currentUser) {
    console.log("Property in detail screen:", property);
    console.log("Current user in detail screen:", currentUser);
    console.log("Property user ID:", typeof property.user === 'object' ? property.user?._id : property.user);
    console.log("Current user ID:", currentUser?._id);
  }
}, [property, currentUser]);

// Simplify the isOwner check
const isOwner = useMemo(() => {
  if (!currentUser || !property) return false;
  
  // Get property owner ID (handling different formats)
  const propertyUserId = 
    typeof property.user === 'object' ? property.user?._id : 
    typeof property.user === 'string' ? property.user : 
    property.ownerId;
  
  // Compare with current user
  const matches = String(currentUser._id) === String(propertyUserId);
  console.log(`Owner check: ${currentUser._id} vs ${propertyUserId} = ${matches}`);
  return matches;
}, [currentUser, property]);

  // Check if the listing is saved when the screen is focused
  useFocusEffect(
    useCallback(() => {
      if (property) {
        checkIfSaved(property.id);
      }
    }, [property])
  );

  // Function to check if listing is saved
  const checkIfSaved = async (listingId) => {
    try {
      const savedJSON = await AsyncStorage.getItem('savedListings');
      if (!savedJSON) {
        setIsSaved(false);
        return;
      }
      
      const savedListings = JSON.parse(savedJSON);
      const saved = savedListings.some(item => String(item.id) === String(listingId));
      setIsSaved(saved);
    } catch (error) {
      console.error('Error checking saved status:', error);
      setIsSaved(false);
    }
  };

  useEffect(() => {
    // Use the passed item if available, otherwise fetch data
    if (passedItem) {
      setProperty(passedItem);
      setLoading(false);
      checkIfSaved(passedItem.id);
      return;
    }
    
    // In a real app, fetch property details from API
    // For now, use dummy data
    const dummyProperty = {
      id: id,
      title: 'Spacious 2-Bedroom Apartment',
      price: 1800,
      description: 'Beautiful apartment with modern amenities, close to public transportation.',
      location: 'Silver Spring, MD',
      photos: ['https://example.com/rent-image-1.jpg'],
      ownerId: 'owner123', // This would be the actual owner ID
      phoneNumber: '301-555-1234', // Important: Make sure this is included
      amenities: ['Washer/Dryer', 'Parking', 'Pet Friendly'],
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      availableFrom: '2025-04-01',
      category: 'rent'
    };
    
    setProperty(dummyProperty);
    setLoading(false);
    checkIfSaved(id);
  }, [id, passedItem]);


  
  
  const handleSaveToggle = async () => {
    if (!property) return;
    
    setLoadingSave(true);
    try {
      const savedJSON = await AsyncStorage.getItem('savedListings');
      const savedListings = savedJSON ? JSON.parse(savedJSON) : [];
      
      if (isSaved) {
        // Remove from saved
        const updatedListings = savedListings.filter(
          item => String(item.id) !== String(property.id)
        );
        
        await AsyncStorage.setItem('savedListings', JSON.stringify(updatedListings));
        setIsSaved(false);
        
        Alert.alert(
          t('removed') || 'Removed',
          t('listingRemovedFromSaved') || 'Listing removed from saved items'
        );
      } else {
        // Add to saved with timestamp
        const listingToSave = {
          ...property,
          savedAt: new Date().toISOString(),
          category: category || property.category || 'rent'
        };
        
        // Check if already saved (by ID)
        const alreadySaved = savedListings.some(
          item => String(item.id) === String(property.id)
        );
        
        if (!alreadySaved) {
          savedListings.push(listingToSave);
          await AsyncStorage.setItem('savedListings', JSON.stringify(savedListings));
          setIsSaved(true);
          
          Alert.alert(
            t('saved') || 'Saved',
            t('listingSavedSuccess') || 'Listing saved successfully'
          );
        }
      }
    } catch (error) {
      console.error('Error saving/removing listing:', error);
      Alert.alert(
        t('error') || 'Error',
        t('errorSavingListing') || 'There was a problem saving this listing'
      );
    } finally {
      setLoadingSave(false);
    }
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5eaaa8" />
          <Text style={styles.loadingText}>{t('loading') || 'Loading...'}</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header with back button and options menu */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('propertyDetails') || 'Property Details'}</Text>
          
          {/* Show options menu if the user owns this listing */}
          {isOwner ? (
            <ListingOptionsMenu 
              listingId={property.id || property._id}
              listingTitle={property.title}
              listingUserId={typeof property.user === 'string' ? property.user : property.user?._id}
             // isOwner={isOwner}
              navigation={navigation}
            />
          ) : (
            <View style={styles.headerRight}>
                <Text style={{fontSize: 10, color: '#999'}}>Not owner</Text>
            </View>
          )}
        </View>
        
        {/* Property Image */}
        {property.photos && property.photos.length > 0 ? (
            <Image 
              source={{ 
                 uri: `http://7.224.4.183:3001${property.photos[0]}`
              }} 
              style={styles.propertyImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.propertyImagePlaceholder}>
              <Ionicons name="home-outline" size={60} color="#ccc" />
            </View>
          )}

        
        {/* Property Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.price}>${property.price}/mo</Text>
          <Text style={styles.title}>{property.title}</Text>
          <Text style={styles.location}>
            <Ionicons name="location-outline" size={16} color="#666" /> {property.location}
          </Text>
          
          {/* Property Specs */}
          <View style={styles.specsContainer}>
            <View style={styles.specItem}>
              <Ionicons name="bed-outline" size={20} color="#5eaaa8" />
              <Text style={styles.specText}>{property.bedrooms || 2} {t('bedrooms') || 'Bedrooms'}</Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="water-outline" size={20} color="#5eaaa8" />
              <Text style={styles.specText}>{property.bathrooms || 2} {t('bathrooms') || 'Bathrooms'}</Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="resize-outline" size={20} color="#5eaaa8" />
              <Text style={styles.specText}>{property.sqft || 1200} sqft</Text>
            </View>
          </View>
          
          {/* Available From */}
          <View style={styles.availableContainer}>
            <Text style={styles.availableLabel}>{t('availableFrom') || 'Available From'}</Text>
            <Text style={styles.availableDate}>
              {new Date(property.availableFrom || new Date()).toLocaleDateString()}
            </Text>
          </View>
          
          {/* Contact Information - Explicitly display the phone number */}
          <View style={styles.contactInfoContainer}>
            <Text style={styles.sectionTitle}>{t('contactInfo') || 'Contact Information'}</Text>
            {property.phoneNumber ? (
              <View style={styles.phoneContainer}>
                <Ionicons name="call-outline" size={18} color="#5eaaa8" />
                <Text style={styles.phoneNumber}>{property.phoneNumber}</Text>
              </View>
            ) : (
              <Text style={styles.noPhoneText}>{t('noPhoneProvided') || 'No phone number provided'}</Text>
            )}
          </View>
          
          {/* Description */}
          <Text style={styles.sectionTitle}>{t('description') || 'Description'}</Text>
          <Text style={styles.description}>{property.description}</Text>
          
          {/* Amenities */}
          <Text style={styles.sectionTitle}>{t('amenities') || 'Amenities'}</Text>
          <View style={styles.amenitiesContainer}>
            {(property.amenities || ['Washer/Dryer', 'Parking', 'Pet Friendly']).map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Ionicons name="checkmark-circle" size={16} color="#5eaaa8" />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
          
          {/* Action Buttons - Don't show for the owner of the listing */}
          {!isOwner && (
            <View style={styles.actionButtons}>
              {/* Save button */}
              <TouchableOpacity 
                style={[styles.saveButton, isSaved && styles.savedButton]}
                onPress={handleSaveToggle}
                disabled={loadingSave}
              >
                {loadingSave ? (
                  <ActivityIndicator size="small" color={isSaved ? "#fff" : "#5eaaa8"} />
                ) : (
                  <>
                    <Ionicons 
                      name={isSaved ? "bookmark" : "bookmark-outline"} 
                      size={18} 
                      color={isSaved ? "#fff" : "#5eaaa8"} 
                    />
                    <Text style={[styles.saveButtonText, isSaved && styles.savedButtonText]}>
                      {isSaved ? (t('saved') || 'Saved') : (t('save') || 'Save')}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              
              {/* Contact button - Pass the phone number to ContactButton */}
              <ContactButton 
                phoneNumber={property.phoneNumber}
                listingTitle={property.title}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 50,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 30, // Balance the header
  },
  propertyImage: {
    height: 250,
    width: '100%',
  },
  propertyImagePlaceholder: {
    height: 250,
    width: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5eaaa8',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  specsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specText: {
    marginLeft: 5,
    color: '#666',
  },
  availableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  availableLabel: {
    fontSize: 16,
    color: '#333',
  },
  availableDate: {
    fontSize: 16,
    color: '#5eaaa8',
    fontWeight: 'bold',
  },
  contactInfoContainer: {
    marginTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  phoneNumber: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  noPhoneText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  amenitiesContainer: {
    marginTop: 5,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  amenityText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5eaaa8',
    flex: 1,
    marginRight: 10,
  },
  savedButton: {
    backgroundColor: '#5eaaa8',
    borderColor: '#5eaaa8',
  },
  saveButtonText: {
    color: '#5eaaa8',
    fontWeight: '600',
    marginLeft: 5,
  },
  savedButtonText: {
    color: '#fff',
  },
});

export default RentDetailsScreen;