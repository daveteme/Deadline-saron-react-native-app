// screens/CategoryScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import QuickContactButton from '../components/shared/QuickContactButton';

const CategoryScreen = ({ route, navigation }) => {
    const { category } = route.params;
    const { t } = useTranslation();
    const listings = useSelector(state => 
        state.listings.items.filter(item => item.category === category)
    );

    // Dummy data for demonstration when no listings exist
    const dummyListings = {
        rent: [
            {
                id: 'd1',
                title: 'Spacious 2-Bedroom Apartment',
                price: 1800,
                description: 'Beautiful apartment with modern amenities, close to public transportation.',
                location: 'Silver Spring, MD',
                photos: ['https://example.com/rent-image-1.jpg'],
                ownerId: 'owner123' // Added ownerId for messaging
            },
            {
                id: 'd2',
                title: 'Cozy 1-Bedroom Apartment',
                price: 1500,
                description: 'Cozy apartment in a quiet neighborhood with easy access to shopping.',
                location: 'Rockville, MD',
                photos: ['https://example.com/rent-image-2.jpg'],
                ownerId: 'owner456' // Added ownerId for messaging
            }
        ],
        jobs: [
            {
                id: 'd3',
                title: 'Restaurant Server',
                salary: '18-22/hr',
                description: 'Looking for experienced servers for an Ethiopian restaurant.',
                location: 'Alexandria, VA',
                company: 'Habesha Restaurant',
                ownerId: 'employer123' // Added ownerId for messaging
            },
            {
                id: 'd4',
                title: 'Office Assistant',
                salary: '45,000/year',
                description: 'Administrative support for a growing import/export business.',
                location: 'Washington, DC',
                company: 'East African Imports',
                ownerId: 'employer456' // Added ownerId for messaging
            }
        ],
        event: [
            {
                id: 'd5',
                title: 'Ethiopian New Year Celebration',
                description: 'Join us for food, music, and cultural performances.',
                location: 'Lincoln Theater, Washington DC',
                startDate: '2025-09-11T18:00:00',
                endDate: '2025-09-11T23:00:00',
                ownerId: 'organizer123' // Added ownerId for messaging
            }
        ],
        services: [
            {
                id: 'd6',
                title: 'Professional Translation Services',
                description: 'Amharic, Tigrinya, and English translation for documents and meetings.',
                location: 'DMV Area',
                ownerId: 'service123' // Added ownerId for messaging
            }
        ]
    };

    // Combine real listings with dummy data if category exists in dummy data
    const displayListings = listings.length > 0 ? listings : 
        (dummyListings[category] ? dummyListings[category] : []);

    // Helper function to get category icon
    const getCategoryIcon = (categoryName) => {
        switch(categoryName) {
            case 'rent': return 'home-outline';
            case 'jobs': return 'briefcase-outline';
            case 'event': return 'calendar-outline';
            case 'services': return 'construct-outline';
            case 'ad': return 'megaphone-outline';
            case 'voluntary': return 'hand-left-outline';
            case 'churches': return 'business-outline';
            case 'restaurants': return 'restaurant-outline';
            default: return 'list-outline';
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => {
                // Navigate to detail screen based on category
                const getDetailScreenName = (categoryName) => {
                    // Map category names to their respective detail screen names
                    const screenMapping = {
                        'rent': 'RentDetails',
                        'event': 'EventDetails',
                        'jobs': 'JobDetails',
                        'services': 'ServiceDetails',
                        'ad': 'AdDetails',
                        // Add other mappings as needed
                    };
                    
                    // Use the mapping if it exists, otherwise use the default format
                    return screenMapping[categoryName] || 
                        `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}Details`;
                };
                
                // Navigate with item object instead of just ID
                navigation.navigate(getDetailScreenName(category), { 
                    id: item.id || item._id,
                    item: { ...item, user: item.user || item.ownerId}, // Pass the entire item for easier access
                    category: category // Pass category for context
                });
            }}
        >
            {/* Image or placeholder */}
            {item.photos && item.photos.length > 0 ? (
                <Image 
                    source={{ 
                        uri: item.photos[0].startsWith('http') 
                            ? item.photos[0] 
                            : `http://your-api-base-url.com${item.photos[0]}` 
                    }}
                    style={styles.image}
                    defaultSource={require('../assets/images/logo.png')}
                />
            ) : (
                <View style={[styles.image, styles.placeholderImage]}>
                    <Ionicons 
                        name={getCategoryIcon(category)} 
                        size={40} 
                        color="#5eaaa8" 
                    />
                </View>
            )}
            
            {/* Card content */}
            <View style={styles.cardContent}>
                <Text style={styles.title}>{item.title}</Text>
                {(category === 'rent' && item.price) && (
                    <Text style={styles.price}>${item.price}/mo</Text>
                )}
                {(category === 'jobs' && item.salary) && (
                    <Text style={styles.price}>${item.salary}</Text>
                )}
                {item.description && (
                    <Text style={styles.description} numberOfLines={2}>
                        {item.description}
                    </Text>
                )}
                {item.location && (
                    <Text style={styles.location}>
                        <Ionicons name="location-outline" size={12} color="#888" /> {item.location}
                    </Text>
                )}
                {(category === 'event' && item.startDate) && (
                    <Text style={styles.date}>
                        <Ionicons name="calendar-outline" size={12} color="#5eaaa8" /> {new Date(item.startDate).toLocaleDateString()}
                    </Text>
                )}
                
                {/* Card footer with contact button */}
                <View style={styles.cardFooter}>
                    <QuickContactButton
                        listingId={item.id || item._id}
                        ownerId={item.ownerId || item.owner_id || item.userId || item.user}
                        listingTitle={item.title}
                        listingType={category}
                        compact={true}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t(category)}</Text>
                <View style={styles.headerRight} />
            </View>
            
            <FlatList
                data={displayListings}
                renderItem={renderItem}
                keyExtractor={item => (item._id || item.id || '').toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="alert-circle-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>
                            {t('noListingsFound')}
                        </Text>
                        <TouchableOpacity 
                            style={styles.createButton}
                            onPress={() => navigation.navigate('CreateListing', { category })}
                        >
                            <Text style={styles.createButtonText}>
                                {t('createListing', { category: t(category) })}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            
            <TouchableOpacity 
                style={styles.fab}
                onPress={() => navigation.navigate('CreateListing', { category })}
            >
                <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
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
    listContainer: {
        padding: 15,
        paddingBottom: 80, // Space for FAB
    },
    card: {
        backgroundColor: 'white',
        marginBottom: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    image: {
        height: 180,
        width: '100%',
        backgroundColor: '#f0f0f0',
    },
    placeholderImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        padding: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    price: {
        fontSize: 16,
        color: '#5eaaa8',
        fontWeight: 'bold',
        marginTop: 4,
    },
    description: {
        color: '#666',
        marginTop: 4,
        lineHeight: 20,
    },
    location: {
        color: '#888',
        fontSize: 14,
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    date: {
        color: '#5eaaa8',
        fontSize: 14,
        marginTop: 4,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        marginTop: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        marginTop: 50,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 20,
        color: '#666',
        fontSize: 16,
    },
    createButton: {
        backgroundColor: '#5eaaa8',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    createButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#5eaaa8',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
});

export default CategoryScreen;