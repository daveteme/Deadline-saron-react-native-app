import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const ImageUpload = ({ onImagesSelected, maxImages = 5 }) => {
  const [images, setImages] = useState([]);
  const [loadingError, setLoadingError] = useState(false);

  const handleImagePicker = async () => {
    try {
      // Reset any previous loading errors
      setLoadingError(false);
      
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'Permission to access camera roll is required!');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7, // Set quality here instead of using compression
      });
      
      console.log('Image picker result:', result);
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (images.length >= maxImages) {
          Alert.alert('Maximum Images', `You can only upload a maximum of ${maxImages} images`);
          return;
        }
        
        const selectedImage = result.assets[0];
        console.log('Selected image:', selectedImage);
        
        // Use the image URI directly without compression
        const newImages = [...images, { 
          ...selectedImage, 
          key: `image-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` // Add a unique key
        }];
        
        setImages(newImages);
        onImagesSelected(newImages);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', `Failed to pick image: ${error.message}`);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesSelected(newImages);
  };

  const handleImageError = (index) => {
    console.error(`Error loading image at index ${index}`);
    setLoadingError(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={images}
        //keyExtractor={(item) => item.key || item.uri || Math.random().toString()}
        keyExtractor={(item) => item.key || item.uri || Math.random().toString()}

        renderItem={({ item, index }) => (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: item.uri }} 
              style={styles.image} 
              onError={() => handleImageError(index)}
              defaultSource={require('../../../assets/images/logo.png')}
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            >
              <Ionicons name="close-circle" size={24} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          images.length < maxImages && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleImagePicker}
            >
              <Ionicons name="add" size={40} color="#5eaaa8" />
            </TouchableOpacity>
          )
        }
      />
      {images.length === 0 && (
        <Text style={styles.helperText}>
          Tap the + button to add photos (Max {maxImages})
        </Text>
      )}
      {loadingError && (
        <Text style={styles.errorText}>
          There was an error loading one or more images.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f0f0f0', // Light gray background as placeholder
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  addButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  helperText: {
    color: '#666',
    marginTop: 10,
    fontSize: 14,
  },
  errorText: {
    color: '#e74c3c',
    marginTop: 10,
    fontSize: 14,
  },
});

export default ImageUpload;
