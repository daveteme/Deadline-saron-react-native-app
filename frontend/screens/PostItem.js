import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';



const PostItem = ({ navigation }) => {
    const { t } = useTranslation();

    const categories = [
      { id: 1, name: 'rent', icon: 'home-outline', title: t('rent') },
       { id: 2, name: 'ad', icon: 'megaphone-outline', title: t('ad') },
       { id: 3, name: 'event', icon: 'calendar-outline', title: t('event') },
       { id: 4, name: 'jobs', icon: 'briefcase-outline', title: t('jobs') },
       { id: 5, name: 'services', icon: 'construct-outline', title: t('services') },
       { id: 6, name: 'voluntary', icon: 'hand-left-outline', title: t('voluntary') },
       { id: 7, name: 'churches', icon: 'business-outline', title: t('churches') },
       { id: 8, name: 'restaurants', icon: 'restaurant-outline', title: t('restaurants') }
     
   ];

    const handleCategorySelect = (category) => {
      navigation.navigate('CreateListing', { category: category.name });
    };
    return (
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('selectCategory')}</Text>
            <Text style={styles.subtitle}>{t('chooseCategoryToPost')}</Text>
          </View>
    
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategorySelect(category)}
              >
                <Ionicons 
                  name={category.icon} 
                  size={32} 
                  color="#5eaaa8" 
                />
                <Text style={styles.categoryText}>
                  {t(category.name)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      );
    };


    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#f8f9fa',
        },
        header: {
          padding: 20,
          backgroundColor: '#fff',
          paddingTop: 80, 
        },
        title: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#333',
          marginBottom: 8,
        },
        subtitle: {
          fontSize: 16,
          color: '#666',
        },
        categoriesGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          padding: 10,
        },
        categoryCard: {
          width: '45%',
          backgroundColor: '#fff',
          margin: '2.5%',
          padding: 20,
          borderRadius: 12,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        },
        categoryText: {
          marginTop: 10,
          fontSize: 14,
          color: '#333',
          textAlign: 'center',
        }
      });
      
      export default PostItem;