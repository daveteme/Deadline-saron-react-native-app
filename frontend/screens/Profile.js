import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    ScrollView, 
    TouchableOpacity, 
    Image,
    Alert,
    Switch,
    TextInput,
    Modal
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { logoutUser, updateProfile } from '../features/authorization/authSlice';
import ImageUpload from '../components/shared/ImageUpload';

const Profile = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.currentUser);
    const listings = useSelector(state => state.listings.items);
    
    const [isEditMode, setIsEditMode] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || 'Guest User',
        email: user?.email || 'guest@example.com',
        phone: user?.phone || '',
        bio: user?.bio || '',
        profileImage: user?.profileImage || null
    });
    
    // Filter listings created by the current user
    const userListings = listings.filter(listing => listing.user && (listing.user._id === user?._id || listing.user === user?._id));
    
    const handleLogout = () => {
        Alert.alert(
            t('confirmLogout'),
            t('logoutMessage'),
            [
                {
                    text: t('cancel'),
                    style: 'cancel'
                },
                {
                    text: t('logout'),
                    onPress: () => {
                        dispatch(logoutUser());
                        navigation.reset({
                            index: 0, 
                            routes: [{ name: 'Login' }]
                        })
                    }
                }
            ]
        );
    };
    
    const handleSaveProfile = () => {
        dispatch(updateProfile(profileData))
        .unwrap()
        .then(() => {
            setIsEditMode(false);
            Alert.alert(t('success'), t('profileUpdated'))
        })
        .catch((error) => {
            Alert.alert(t('error'), error || t('updateFailed'))
        })
    };
    
    const handleImageSelected = (images) => {
        if (images.length > 0) {
            setProfileData({
                ...profileData,
                profileImage: images[0].uri
            });
        }
    };
    
    const handleLanguageChange = (langCode) => {
        i18n.changeLanguage(langCode);
        setShowLanguageModal(false);
    };
    
    const renderProfileHeader = () => (
        <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
                {isEditMode ? (
                    <ImageUpload 
                        onImagesSelected={handleImageSelected}
                        maxImages={1}
                    />
                ) : (
                    profileData.profileImage ? (
                        <Image 
                            source={{ uri: profileData.profileImage }} 
                            style={styles.profileImage} 
                        />
                    ) : (
                        <View style={styles.profileImagePlaceholder}>
                            <Ionicons name="person" size={60} color="#5eaaa8" />
                        </View>
                    )
                )}
            </View>
            
            <View style={styles.profileInfo}>
                {isEditMode ? (
                    <TextInput
                        style={styles.nameInput}
                        value={profileData.name}
                        onChangeText={(text) => setProfileData({...profileData, name: text})}
                        placeholder={t('name')}
                    />
                ) : (
                    <Text style={styles.userName}>{profileData.name}</Text>
                )}
                
                <Text style={styles.userEmail}>{profileData.email}</Text>
                
                {!isEditMode && (
                    <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => setIsEditMode(true)}
                    >
                        <Text style={styles.editButtonText}>{t('editProfile')}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
    
    const renderEditForm = () => (
        isEditMode && (
            <View style={styles.editForm}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('phone')}</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.phone}
                        onChangeText={(text) => setProfileData({...profileData, phone: text})}
                        placeholder={t('phonePlaceholder')}
                        keyboardType="phone-pad"
                    />
                </View>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('bio')}</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={profileData.bio}
                        onChangeText={(text) => setProfileData({...profileData, bio: text})}
                        placeholder={t('bioPlaceholder')}
                        multiline
                        numberOfLines={4}
                    />
                </View>
                
                <View style={styles.buttonRow}>
                    <TouchableOpacity 
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => setIsEditMode(false)}
                    >
                        <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.button, styles.saveButton]}
                        onPress={handleSaveProfile}
                    >
                        <Text style={styles.saveButtonText}>{t('save')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    );
    
    const renderUserListings = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('myListings')}</Text>
            
            {userListings.length > 0 ? (
                userListings.map(listing => (
                    <TouchableOpacity 
                        key={listing._id} // ensure a unique key for each item
                        style={styles.listingItem}
                        onPress={() => {
                            const detailScreenName = `${listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}Details`;
                            navigation.navigate(detailScreenName, { id: listing._id, item: listing, category: listing.category });
                        }}
                    >
                        <View style={styles.listingInfo}>
                            <Text style={styles.listingTitle}>{listing.title}</Text>
                            <Text style={styles.listingCategory}>{t(listing.category)}</Text>
                            <Text style={styles.listingDate}>
                                {new Date(listing.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                        
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>
                ))
            ) : (
                <View style={styles.emptyState}>
                    <Ionicons name="document-outline" size={40} color="#ccc" />
                    <Text style={styles.emptyStateText}>{t('noListingsYet')}</Text>
                    <TouchableOpacity 
                        style={styles.createButton}
                        onPress={() => navigation.navigate('PostItem')}
                    >
                        <Text style={styles.createButtonText}>{t('createListing')}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
    
    const renderSettings = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings')}</Text>
            
            <TouchableOpacity 
                style={styles.settingItem}
                onPress={() => setShowLanguageModal(true)}
            >
                <View style={styles.settingInfo}>
                    <Ionicons name="language-outline" size={22} color="#5eaaa8" />
                    <Text style={styles.settingText}>{t('language')}</Text>
                </View>
                <Text style={styles.settingValue}>
                    {i18n.language === 'en' ? 'English' : 
                     i18n.language === 'am' ? 'አማርኛ' : 
                     i18n.language === 'ti' ? 'ትግርኛ' : 'English'}
                </Text>
            </TouchableOpacity>
            
            <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                    <Ionicons name="notifications-outline" size={22} color="#5eaaa8" />
                    <Text style={styles.settingText}>{t('notifications')}</Text>
                </View>
                <Switch
                    value={true}
                    onValueChange={() => {}}
                    trackColor={{ false: '#ddd', true: '#a3d9d7' }}
                    thumbColor={'#5eaaa8'}
                />
            </View>
            
            <TouchableOpacity 
                style={styles.settingItem}
                onPress={handleLogout}
            >
                <View style={styles.settingInfo}>
                    <Ionicons name="log-out-outline" size={22} color="#e74c3c" />
                    <Text style={[styles.settingText, { color: '#e74c3c' }]}>{t('logout')}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
    
    const renderLanguageModal = () => (
        <Modal
            visible={showLanguageModal}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
                        <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity 
                        style={[
                            styles.languageOption,
                            i18n.language === 'en' && styles.selectedLanguage
                        ]}
                        onPress={() => handleLanguageChange('en')}
                    >
                        <Text style={[
                            styles.languageText,
                            i18n.language === 'en' && styles.selectedLanguageText
                        ]}>English</Text>
                        {i18n.language === 'en' && (
                            <Ionicons name="checkmark" size={20} color="#5eaaa8" />
                        )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[
                            styles.languageOption,
                            i18n.language === 'am' && styles.selectedLanguage
                        ]}
                        onPress={() => handleLanguageChange('am')}
                    >
                        <Text style={[
                            styles.languageText,
                            i18n.language === 'am' && styles.selectedLanguageText
                        ]}>አማርኛ</Text>
                        {i18n.language === 'am' && (
                            <Ionicons name="checkmark" size={20} color="#5eaaa8" />
                        )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[
                            styles.languageOption,
                            i18n.language === 'ti' && styles.selectedLanguage
                        ]}
                        onPress={() => handleLanguageChange('ti')}
                    >
                        <Text style={[
                            styles.languageText,
                            i18n.language === 'ti' && styles.selectedLanguageText
                        ]}>ትግርኛ</Text>
                        {i18n.language === 'ti' && (
                            <Ionicons name="checkmark" size={20} color="#5eaaa8" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {renderProfileHeader()}
                {renderEditForm()}
                {!isEditMode && (
                    <>
                        {renderUserListings()}
                        {renderSettings()}
                    </>
                )}
            </ScrollView>
            {renderLanguageModal()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    profileHeader: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingTop: 60,
    },
    profileImageContainer: {
        marginRight: 20,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f0f0f0',
    },
    profileImagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    editButton: {
        backgroundColor: '#5eaaa8',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    nameInput: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 10,
        paddingVertical: 5,
    },
    editForm: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f8f9fa',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '500',
    },
    saveButton: {
        backgroundColor: '#5eaaa8',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '500',
    },
    section: {
        padding: 20,
        backgroundColor: '#fff',
        marginTop: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    listingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    listingInfo: {
        flex: 1,
    },
    listingTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    listingCategory: {
        fontSize: 14,
        color: '#5eaaa8',
        marginBottom: 2,
    },
    listingDate: {
        fontSize: 12,
        color: '#999',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
        marginBottom: 20,
    },
    createButton: {
        backgroundColor: '#5eaaa8',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    createButtonText: {
        color: '#fff',
        fontWeight: '500',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
    },
    settingValue: {
        fontSize: 14,
        color: '#999',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    languageOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedLanguage: {
        backgroundColor: '#f0f8f8',
    },
    languageText: {
        fontSize: 16,
        color: '#333',
    },
    selectedLanguageText: {
        color: '#5eaaa8',
        fontWeight: '500',
    }
});

export default Profile;
