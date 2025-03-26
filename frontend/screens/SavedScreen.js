// screens/SavedScreen.js
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SavedScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedListings();
    
    // Reload when screen focuses
    const unsubscribe = navigation.addListener('focus', () => {
      loadSavedListings();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadSavedListings = async () => {
    try {
      setLoading(true);
      const savedJSON = await AsyncStorage.getItem('savedListings');
      if (savedJSON) {
        const saved = JSON.parse(savedJSON);
        setSavedListings(saved);
      } else {
        setSavedListings([]);
      }
    } catch (error) {
      console.error('Error loading saved listings:', error);
      Alert.alert(
        t('error'),
        t('errorLoadingSaved')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (itemId) => {
    try {
      // Filter out the listing to remove
      const updatedListings = savedListings.filter(item => item.id !== itemId);
      
      // Save back to AsyncStorage
      await AsyncStorage.setItem('savedListings', JSON.stringify(updatedListings));
      
      // Update state
      setSavedListings(updatedListings);
      
      // Show confirmation
      Alert.alert(
        t('removed'),
        t('listingRemovedFromSaved')
      );
    } catch (error) {
      console.error('Error removing saved listing:', error);
      Alert.alert(
        t('error'),
        t('errorRemovingSaved')
      );
    }
  };

  const handleViewListing = (item) => {
    // Navigate based on category
    if (item.category === 'rent') {
      navigation.navigate('RentDetailsScreen', { 
        id: item.id, 
        item: item,
        category: item.category
      });
    } else if (item.category) {
      // Handle other categories
      navigation.navigate('CategoryScreen', {
        selectedCategory: item.category,
        selectedItem: item
      });
    } else {
      // Fallback navigation
      navigation.navigate('Home');
      Alert.alert(
        t('error'),
        t('errorViewingListing')
      );
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.listingItem}
      onPress={() => handleViewListing(item)}
    >
      {/* Image */}
      {item.photos && item.photos.length > 0 ? (
        <Image 
          source={{ uri: item.photos[0] }} 
          style={styles.listingImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.listingImagePlaceholder}>
          <Ionicons name="image-outline" size={40} color="#ccc" />
        </View>
      )}
      
      {/* Content */}
      <View style={styles.listingDetails}>
        <View style={styles.listingHeader}>
          <Text style={styles.listingTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <TouchableOpacity
            onPress={() => handleRemoveSaved(item.id)}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Ionicons name="close-circle" size={24} color="#aaa" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.listingPrice}>
          {item.price ? `$${item.price}${item.category === 'rent' ? '/mo' : ''}` : ''}
        </Text>
        
        <Text style={styles.listingLocation} numberOfLines={1}>
          <Ionicons name="location-outline" size={14} color="#666" /> {item.location || 'Location not specified'}
        </Text>
        
        <View style={styles.listingFooter}>
          <Text style={styles.listingCategory}>
            <Ionicons name="pricetag-outline" size={12} color="#5eaaa8" /> {t(item.category || 'listing')}
          </Text>
          <Text style={styles.savedDate}>
            {new Date(item.savedAt || new Date()).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('savedListings') || 'Saved Listings'}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5eaaa8" />
          <Text style={styles.loadingText}>{t('loading') || 'Loading...'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('savedListings') || 'Saved Listings'}</Text>
      </View>
      
      {savedListings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark" size={60} color="#ccc" />
          <Text style={styles.emptyTitle}>{t('noSavedListings') || 'No Saved Listings'}</Text>
          <Text style={styles.emptySubtitle}>
            {t('savedListingsDescription') || 'Your saved listings will appear here. Browse listings and tap the bookmark icon to save them.'}
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseButtonText}>{t('browseListing') || 'Browse Listings'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={savedListings}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
  listContainer: {
    padding: 15,
  },
  listingItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listingImage: {
    width: 120,
    height: 120,
  },
  listingImagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listingDetails: {
    flex: 1,
    padding: 12,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 5,
  },
  listingPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5eaaa8',
    marginTop: 4,
  },
  listingLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  listingCategory: {
    fontSize: 12,
    color: '#5eaaa8',
    backgroundColor: '#e6f3f3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  savedDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#5eaaa8',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SavedScreen;