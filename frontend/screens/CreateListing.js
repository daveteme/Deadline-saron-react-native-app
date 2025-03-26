import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { createNewListing, uploadListingImages } from '../features/listings/listingSlice.js'
import ImageUpload from '../components/shared/ImageUpload.js';

const CreateListing = ({ route, navigation }) => {
    const { category } = route.params;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.currentUser);
    


    //console.log("Auth state in CreateListing:", user);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [photos, setPhotos] = useState([]);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        category: category,
        // Add phone number for all categories, but it will be required only for rent
        phoneNumber: '',
        // Add category-specific fields
        ...(category === 'rent' && { price: '', bedrooms: '', bathrooms: '', propertyType: 'apartment' }),
        ...(category === 'jobs' && { salary: '', company: '', jobType: 'fulltime' }),
        ...(category === 'event' && { startDate: '', endDate: '', venue: '' }),
        ...(category === 'services' && { serviceType: '', rate: '' }),
        ...(category === 'ad' && { adType: 'sale' }),
        ...(category === 'restaurants' && { cuisine: '', priceRange: 'moderate' }),
        ...(category === 'churches' && { denomination: '', serviceTime: '' }),
        ...(category === 'voluntary' && { organization: '', commitment: '' })
    });

    const validateForm = () => {
        const newErrors = {};
        
        // Validate required fields
        if (!formData.title.trim()) newErrors.title = t('fieldRequired');
        if (!formData.description.trim()) newErrors.description = t('fieldRequired');
        if (!formData.location.trim()) newErrors.location = t('fieldRequired');
        
        // Validate phone number - required for rent category
        if (category === 'rent' && !formData.phoneNumber.trim()) {
            newErrors.phoneNumber = t('phoneNumberRequired');
        }
        
        // Basic phone format validation if provided
        if (formData.phoneNumber.trim() && !/^[0-9\s\(\)\+\-]{7,15}$/.test(formData.phoneNumber.trim())) {
            newErrors.phoneNumber = t('invalidPhoneFormat');
        }
        
        // Category-specific validation
        if (category === 'rent') {
            if (!formData.price) newErrors.price = t('fieldRequired');
            else if (isNaN(formData.price)) newErrors.price = t('mustBeNumber');
            
            if (formData.bedrooms && isNaN(formData.bedrooms)) 
                newErrors.bedrooms = t('mustBeNumber');
                
            if (formData.bathrooms && isNaN(formData.bathrooms)) 
                newErrors.bathrooms = t('mustBeNumber');
        }
        
        if (category === 'jobs' && formData.salary && isNaN(formData.salary.replace(/[^0-9]/g, ''))) 
            newErrors.salary = t('invalidSalary');
            
        if (category === 'event') {
            if (!formData.startDate) newErrors.startDate = t('fieldRequired');
            if (!formData.endDate) newErrors.endDate = t('fieldRequired');
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            Alert.alert(t('validationError'), t('pleaseFixErrors'));
            return;
        }

        if(!user) {
            Alert.alert(t('Authentication Error'), t('You must be logged in to create a listing'));
            return;
        }
        
        setIsSubmitting(true);
        
        // Create listing object with all form data
        const newListing = {
            title: formData.title,
            description: formData.description,
            location: formData.location,
            category: category,
            phoneNumber: formData.phoneNumber.trim(), // Add phone number to all listings
            ownerId: user?._id, 
            user: user?._id || "", 
            
            // Rent category fields
            ...(category === 'rent' && { 
                price: Number(formData.price || 0),
                bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
                bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
                propertyType: formData.propertyType 
            }),
            
            // Jobs category fields
            ...(category === 'jobs' && {
                salary: formData.salary,
                company: formData.company,
                jobType: formData.jobType
            }),
            
            // Event category fields
            ...(category === 'event' && {
                startDate: formData.startDate,
                endDate: formData.endDate,
                venue: formData.venue
            }),
            
            // Services category fields
            ...(category === 'services' && {
                serviceType: formData.serviceType,
                rate: formData.rate
            }),
            
            // Ad category fields
            ...(category === 'ad' && {
                adType: formData.adType
            }),
            
            // Restaurants category fields
            ...(category === 'restaurants' && {
                cuisine: formData.cuisine,
                priceRange: formData.priceRange
            }),
            
            // Churches category fields
            ...(category === 'churches' && {
                denomination: formData.denomination,
                serviceTime: formData.serviceTime
            }),
            
            // Voluntary category fields
            ...(category === 'voluntary' && {
                organization: formData.organization,
                commitment: formData.commitment
            })
        };

        console.log("About to create listing with user:", user);
        console.log("User ID being passed:", user?._id);
    
        try {
            // First create the listing
            const response = await dispatch(createNewListing(newListing)).unwrap();
            console.log("Listing created successfully:", response);
            
            // If we have photos 
            if (photos.length > 0 && response && response._id) {
              console.log("Attempting to upload photos for listing ID:", response._id);
              
                try {
                  // Now upload photos to the created listing
                  const uploadResponse = await dispatch(uploadListingImages({
                    id: response._id,
                    photos: photos
                  })).unwrap();
                  console.log("Photo upload response:", uploadResponse);
                } catch (uploadError) {
                  console.error("Error uploading photos:", uploadError);
                  
                }
              } else {
                console.error("No listing ID found in response:", response);
            }
            
            setIsSubmitting(false);
            Alert.alert(
              t('success'), 
              t('listingCreatedsuccess'), 
              [{ text: t('ok'), onPress: () => navigation.navigate('MainApp')}]
            );
          } catch (error) {
            setIsSubmitting(false);
            console.error("Error in handleSubmit:", error);
            Alert.alert(
              t('error'), 
              error.message || t('listingCreationError'), 
              [{ text: t('ok')}]
            );
          }
    };

    const renderCategorySpecificFields = () => {
        switch(category) {
            case 'rent':
                return (
                    <>
                        {/* Phone Number Field - Required for rentals */}
                        <View style={styles.inputGroup}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>{t('phoneNumber')}</Text>
                                <Text style={styles.required}>*</Text>
                            </View>
                            <TextInput
                                style={[styles.input, errors.phoneNumber && styles.inputError]}
                                placeholder={t('enterPhoneNumber')}
                                keyboardType="phone-pad"
                                value={formData.phoneNumber}
                                onChangeText={(text) => setFormData({...formData, phoneNumber: text})}
                            />
                            {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
                            <Text style={styles.helperText}>
                                {t('phoneNumberHelper') || 'Your phone number will be visible to interested parties'}
                            </Text>
                        </View>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('price')}</Text>
                            <TextInput
                                style={[styles.input, errors.price && styles.inputError]}
                                placeholder="$"
                                keyboardType="numeric"
                                value={formData.price}
                                onChangeText={(text) => setFormData({...formData, price: text})}
                            />
                            {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
                        </View>
                        
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, {flex: 1, marginRight: 10}]}>
                                <Text style={styles.label}>{t('bedrooms')}</Text>
                                <TextInput
                                    style={[styles.input, errors.bedrooms && styles.inputError]}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={formData.bedrooms}
                                    onChangeText={(text) => setFormData({...formData, bedrooms: text})}
                                />
                                {errors.bedrooms && <Text style={styles.errorText}>{errors.bedrooms}</Text>}
                            </View>
                            
                            <View style={[styles.inputGroup, {flex: 1}]}>
                                <Text style={styles.label}>{t('bathrooms')}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={formData.bathrooms}
                                    onChangeText={(text) => setFormData({...formData, bathrooms: text})}
                                />
                            </View>
                        </View>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('propertyType')}</Text>
                            <View style={styles.segmentedControl}>
                                {['apartment', 'house', 'room', 'other'].map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.segment,
                                            formData.propertyType === type && styles.segmentActive
                                        ]}
                                        onPress={() => setFormData({...formData, propertyType: type})}
                                    >
                                        <Text 
                                            style={[
                                                styles.segmentText,
                                                formData.propertyType === type && styles.segmentTextActive
                                            ]}
                                        >
                                            {t(type)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </>
                );
                
            case 'jobs':
                return (
                    <>
                        {/* Optional Phone Number Field for non-rent categories */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('phoneNumber')}</Text>
                            <TextInput
                                style={[styles.input, errors.phoneNumber && styles.inputError]}
                                placeholder={t('enterPhoneNumber')}
                                keyboardType="phone-pad"
                                value={formData.phoneNumber}
                                onChangeText={(text) => setFormData({...formData, phoneNumber: text})}
                            />
                            {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
                            <Text style={styles.helperText}>
                                {t('phoneNumberHelper') || 'Your phone number will be visible to interested parties'}
                            </Text>
                        </View>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('company')}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={t('companyName')}
                                value={formData.company}
                                onChangeText={(text) => setFormData({...formData, company: text})}
                            />
                        </View>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('salary')}</Text>
                            <TextInput
                                style={[styles.input, errors.salary && styles.inputError]}
                                placeholder={t('salaryPlaceholder')}
                                value={formData.salary}
                                onChangeText={(text) => setFormData({...formData, salary: text})}
                            />
                            {errors.salary && <Text style={styles.errorText}>{errors.salary}</Text>}
                        </View>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('jobType')}</Text>
                            <View style={styles.segmentedControl}>
                                {['fulltime', 'parttime', 'contract', 'temporary'].map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.segment,
                                            formData.jobType === type && styles.segmentActive
                                        ]}
                                        onPress={() => setFormData({...formData, jobType: type})}
                                    >
                                        <Text 
                                            style={[
                                                styles.segmentText,
                                                formData.jobType === type && styles.segmentTextActive
                                            ]}
                                        >
                                            {t(type)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </>
                );
                
            case 'event':
                return (
                    <>
                        {/* Optional Phone Number Field for non-rent categories */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('phoneNumber')}</Text>
                            <TextInput
                                style={[styles.input, errors.phoneNumber && styles.inputError]}
                                placeholder={t('enterPhoneNumber')}
                                keyboardType="phone-pad"
                                value={formData.phoneNumber}
                                onChangeText={(text) => setFormData({...formData, phoneNumber: text})}
                            />
                            {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
                            <Text style={styles.helperText}>
                                {t('phoneNumberHelper') || 'Your phone number will be visible to interested parties'}
                            </Text>
                        </View>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('venue')}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={t('venuePlaceholder')}
                                value={formData.venue}
                                onChangeText={(text) => setFormData({...formData, venue: text})}
                            />
                        </View>
                        
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, {flex: 1, marginRight: 10}]}>
                                <Text style={styles.label}>{t('startDate')}</Text>
                                <TextInput
                                    style={[styles.input, errors.startDate && styles.inputError]}
                                    placeholder="YYYY-MM-DD"
                                    value={formData.startDate}
                                    onChangeText={(text) => setFormData({...formData, startDate: text})}
                                />
                                {errors.startDate && <Text style={styles.errorText}>{errors.startDate}</Text>}
                            </View>
                            
                            <View style={[styles.inputGroup, {flex: 1}]}>
                                <Text style={styles.label}>{t('endDate')}</Text>
                                <TextInput
                                    style={[styles.input, errors.endDate && styles.inputError]}
                                    placeholder="YYYY-MM-DD"
                                    value={formData.endDate}
                                    onChangeText={(text) => setFormData({...formData, endDate: text})}
                                />
                                {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}
                            </View>
                        </View>
                    </>
                );
                
            // For other categories, add the optional phone number field
            default:
                return (
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('phoneNumber')}</Text>
                        <TextInput
                            style={[styles.input, errors.phoneNumber && styles.inputError]}
                            placeholder={t('enterPhoneNumber')}
                            keyboardType="phone-pad"
                            value={formData.phoneNumber}
                            onChangeText={(text) => setFormData({...formData, phoneNumber: text})}
                        />
                        {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
                        <Text style={styles.helperText}>
                            {t('phoneNumberHelper') || 'Your phone number will be visible to interested parties'}
                        </Text>
                    </View>
                );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
            >
                <ScrollView>
                    <View style={styles.header}>
                        <TouchableOpacity 
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.title}>
                            {t('createListing', { category: t(category) })}
                        </Text>
                        <View style={{width: 24}} />
                    </View>

                    <View style={styles.form}>
                        {/* Basic Fields */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('title')}</Text>
                            <TextInput
                                style={[styles.input, errors.title && styles.inputError]}
                                placeholder={t('titlePlaceholder')}
                                value={formData.title}
                                onChangeText={(text) => setFormData({...formData, title: text})}
                            />
                            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('description')}</Text>
                            <TextInput
                                style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                                placeholder={t('descriptionPlaceholder')}
                                multiline
                                numberOfLines={4}
                                value={formData.description}
                                onChangeText={(text) => setFormData({...formData, description: text})}
                            />
                            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('location')}</Text>
                            <TextInput
                                style={[styles.input, errors.location && styles.inputError]}
                                placeholder={t('locationPlaceholder')}
                                value={formData.location}
                                onChangeText={(text) => setFormData({...formData, location: text})}
                            />
                            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
                        </View>

                        {/* Category Specific Fields */}
                        {renderCategorySpecificFields()}

                        {/* Photo Upload */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('photos')}</Text>
                            <ImageUpload 
                                onImagesSelected={setPhotos}
                                maxImages={5}
                            />
                        </View>

                        <TouchableOpacity 
                            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitButtonText}>
                                    {t('postListing')}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingTop: 50,
    },
    backButton: {
        padding: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    form: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    inputError: {
        borderColor: '#e74c3c',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 14,
        marginTop: 5,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        overflow: 'hidden',
    },
    segment: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    segmentActive: {
        backgroundColor: '#5eaaa8',
    },
    segmentText: {
        color: '#666',
        fontSize: 14,
    },
    segmentTextActive: {
        color: '#fff',
        fontWeight: '500',
    },
    submitButton: {
        backgroundColor: '#5eaaa8',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#94c5c4',
    },
    submitButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 16,
    }
});

export default CreateListing;