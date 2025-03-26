// components/shared/ListingOptionsMenu.js - Fix color property
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { deleteExistingListing } from '../../features/listings/listingSlice';

const ListingOptionsMenu = ({ listingId, listingUserId, listingTitle, navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get current user from Redux store
  const currentUser = useSelector(state => state.auth.currentUser);
  
  // Check if current user is the owner - modify this line for more robust comparison
  const isOwner = currentUser && 
    (String(currentUser._id) === String(listingUserId) || 
    (currentUser._id && listingUserId && String(currentUser._id) === String(listingUserId)));
   
  console.log("ListingOptionsMenu props:", { 
    listingId, 
    listingUserId, 
    currentUserId: currentUser?._id,
    isOwner: isOwner 
  });
 
  // If not owner, don't render anything
  if (!isOwner) return null;

  const handleDeleteListing = () => {
    // Close menu
    setMenuVisible(false);
    
    // Show confirmation alert
    Alert.alert(
      t('confirmDelete') || 'Confirm Delete',
      t('confirmDeleteMessage', { title: listingTitle }) || `Are you sure you want to delete "${listingTitle}"?`,
      [
        {
          text: t('cancel') || 'Cancel',
          style: 'cancel'
        },
        {
          text: t('delete') || 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await dispatch(deleteExistingListing(listingId)).unwrap();
              setIsDeleting(false);
              
              Alert.alert(
                t('deleted') || 'Deleted',
                t('listingDeleted') || 'Listing has been deleted successfully',
                [
                  {
                    text: t('ok') || 'OK',
                    onPress: () => navigation.goBack()
                  }
                ]
              );
            } catch (error) {
              setIsDeleting(false);
              Alert.alert(
                t('error') || 'Error',
                t('deleteError') || 'An error occurred while deleting the listing'
              );
            }
          }
        }
      ]
    );
  };

  const handleEditListing = () => {
    setMenuVisible(false);
    
    // Navigate to edit screen
    navigation.navigate('CreateListing', { 
      editMode: true, 
      listingId: listingId,
      category: 'rent' // You might want to pass the actual category from the listing
    });
  };

  if (isDeleting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#333" />
      </View>
    );
  }

  return (
    <View>
      {/* Three dots button - Fixed color property */}
      <TouchableOpacity 
        onPress={() => setMenuVisible(true)}
        style={styles.menuButton}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Ionicons name="ellipsis-vertical" size={24} color="#333" />
      </TouchableOpacity>
      
      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.menuContainer}>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={handleEditListing}
              >
                <Ionicons name="create-outline" size={22} color="#333" />
                <Text style={styles.menuItemText}>{t('edit') || 'Edit'}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.menuItem, styles.deleteItem]} 
                onPress={handleDeleteListing}
              >
                <Ionicons name="trash-outline" size={22} color="#ff4d4d" />
                <Text style={[styles.menuItemText, styles.deleteText]}>
                  {t('delete') || 'Delete'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
  },
  loadingContainer: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 60,
    marginRight: 20,
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  deleteItem: {
    borderBottomWidth: 0,
  },
  deleteText: {
    color: '#ff4d4d',
  },
});

export default ListingOptionsMenu;