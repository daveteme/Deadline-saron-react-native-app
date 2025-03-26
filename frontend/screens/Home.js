// screens/Home.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

const Home = ({ navigation }) => {
  const { t } = useTranslation();
  const user = useSelector(state => state.auth.currentUser);
  const listings = useSelector(state => state.listings.items);

  const categories = [
    { id: 1, name: 'rent', icon: 'home-outline', title: t('rent') },
    { id: 2, name: 'ad', icon: 'megaphone-outline', title: t('ad') },
    { id: 3, name: 'event', icon: 'calendar-outline', title: t('event') },
    { id: 4, name: 'jobs', icon: 'briefcase-outline', title: t('jobs') },
    { id: 5, name: 'services', icon: 'construct-outline', title: t('services') },
    { id: 6, name: 'voluntary', icon: 'hand-left-outline', title: t('voluntary') },
    { id: 7, name: 'churches', icon: 'business-outline', title: t('churches') },
    { id: 8, name: 'restaurants', icon: 'restaurant-outline', title: t('restaurants') },
  ];

  // Function to filter listings by category
  const getListingsByCategory = (category) => {
    return listings
      .filter(listing => listing.category === category)
      .slice(0, 3); // Limit to 3 items
  };

  // Dummy rent and ad listings
  const dummyRentListings = [
    {
      id: '1',
      title: 'Spacious 2-Bedroom Apartment',
      price: 1800,
      location: 'Silver Spring, MD',
      photos: ['https://example.com/rent-image-1.jpg']
    },
    {
      id: '2',
      title: 'Cozy 1-Bedroom Apartment',
      price: 1500,
      location: 'Rockville, MD',
      photos: ['https://example.com/rent-image-2.jpg']
    },
    {
      id: '3',
      title: 'Luxury 3-Bedroom Townhouse',
      price: 2500,
      location: 'Fairfax, VA',
      photos: ['https://example.com/rent-image-3.jpg']
    }
  ];

  const dummyAdListings = [
    {
      id: '1',
      title: 'Furniture Sale - Everything Must Go!',
      description: 'Selling all my furniture at discounted prices. Come and check it out!',
    },
    {
      id: '2',
      title: 'Ethiopian Spice Shop Opening Soon',
      description: 'New Ethiopian spice shop coming to the community. Stay tuned for the grand opening!'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>
            {t('welcome')}, {user?.name || t('guest')}
          </Text>
          <Text style={styles.subtitle}>{t('findYourHome')}</Text>
        </View>

        {/* Categories ScrollView */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              onPress={() => navigation.navigate('CategoryScreen', { category: category.name })}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={category.icon} size={24} color="#5eaaa8" />
              </View>
              <Text style={styles.categoryText}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {/* Rent Listings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('rentListings')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CategoryScreen', { category: 'rent' })}>
              <Text style={styles.seeAllText}>{t('seeAll')}</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dummyRentListings.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.propertyCard}
                onPress={() => navigation.navigate('PropertyDetails', { id: item.id })}
              >
                {item.photos && item.photos.length > 0 ? (
                  <Image 
                    source={{ uri: item.photos[0] }} 
                    style={styles.propertyImage} 
                  />
                ) : (
                  <View style={styles.propertyImage} />
                )}
                <View style={styles.propertyInfo}>
                  <Text style={styles.propertyPrice}>${item.price}/mo</Text>
                  <Text style={styles.propertyTitle}>{item.title}</Text>
                  <Text style={styles.propertyLocation}>{item.location}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Ad Listings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('adListings')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CategoryScreen', { category: 'ad' })}>
              <Text style={styles.seeAllText}>{t('seeAll')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.adsList}>
            {dummyAdListings.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.adCard}
                onPress={() => navigation.navigate('AdDetails', { id: item.id })}
              >
                <View style={styles.adInfo}>
                  <Text style={styles.adTitle}>{item.title}</Text>
                  <Text style={styles.adDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Event Listings Section */}
        {getListingsByCategory('event').length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('eventListings')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('CategoryScreen', { category: 'event' })}>
                <Text style={styles.seeAllText}>{t('seeAll')}</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {getListingsByCategory('event').map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.eventCard}
                  onPress={() => navigation.navigate('EventDetails', { id: item.id })}
                >
                  {item.photos && item.photos.length > 0 ? (
                    <Image 
                      source={{ uri: item.photos[0] }} 
                      style={styles.eventImage} 
                    />
                  ) : (
                    <View style={styles.eventImage} />
                  )}
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{item.title}</Text>
                    <Text style={styles.eventLocation}>
                      {item.location || 'Location not specified'}
                    </Text>
                    <Text style={styles.eventDate}>
                      {new Date(item.startDate).toLocaleDateString()} - 
                      {new Date(item.endDate).toLocaleDateString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Job Listings Section */}
        {getListingsByCategory('jobs').length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('jobListings')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('CategoryScreen', { category: 'jobs' })}>
                <Text style={styles.seeAllText}>{t('seeAll')}</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {getListingsByCategory('jobs').map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.jobCard}
                  onPress={() => navigation.navigate('JobDetails', { id: item.id })}
                >
                  <View style={styles.jobInfo}>
                    <Text style={styles.jobTitle}>{item.title}</Text>
                    <Text style={styles.jobCompany}>{item.company}</Text>
                    <Text style={styles.jobSalary}>
                      {item.salary ? `$${item.salary}` : 'Salary not specified'}
                    </Text>
                    <Text style={styles.jobLocation}>
                      {item.location || 'Location not specified'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Other Listings Sections */}
        {['services', 'voluntary', 'churches', 'restaurants'].map((category) => (
          getListingsByCategory(category).length > 0 && (
            <View style={styles.section} key={category}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t(`${category}Listings`)}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('CategoryScreen', { category })}>
                  <Text style={styles.seeAllText}>{t('seeAll')}</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {getListingsByCategory(category).map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.categoryCard}
                    onPress={() => navigation.navigate(`${category.charAt(0).toUpperCase() + category.slice(1)}Details`, { id: item.id })}
                  >
                    {item.photos && item.photos.length > 0 ? (
                      <Image 
                        source={{ uri: item.photos[0] }} 
                        style={styles.categoryImage} 
                      />
                    ) : (
                      <View style={styles.categoryImage} />
                    )}
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryTitle}>{item.title}</Text>
                      <Text style={styles.categoryDescription} numberOfLines={2}>
                        {item.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingTop: 30,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 15,
    width: 70,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f8f8', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  content: {
    flex: 1, 
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    
  },
  seeAllText: {
    color: '#5eaaa8',
    fontWeight: '600',
  },
  propertyCard: {
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyImage: {
    height: 150,
    backgroundColor: '#eee',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  propertyInfo: {
    padding: 12,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5eaaa8',
  },
  propertyTitle: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  adsList: {
    gap: 10,
  },
  adCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  adDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  eventCard: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImage: {
    height: 150,
    backgroundColor: '#eee',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  eventInfo: {
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#5eaaa8',
    marginTop: 4,
  },
  jobCard: {
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobInfo: {
    padding: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  jobCompany: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  jobSalary: {
    fontSize: 14,
    color: '#5eaaa8',
    marginTop: 4,
  },
  jobLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  categoryCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryImage: {
    height: 150,
    backgroundColor: '#eee',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  categoryInfo: {
    padding: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default Home;