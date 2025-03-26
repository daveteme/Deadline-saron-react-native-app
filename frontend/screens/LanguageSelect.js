import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Touchable } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import i18n from '../translations/i18n';
import { setLanguage } from '../features/language/languageSlice';

const LanguageSelect = ({ navigation }) => {
    const dispatch = useDispatch();
    const { i18n } = useTranslation();

    const handleLanguageSelect = (lang) => {
        dispatch(setLanguage(lang));  // update redux state here later of debugging 
        i18n.changeLanguage(lang);   // update i18n language
        navigation.navigate('Login');  // navigate to the login screen
    };

    return (
        <View style={styles.container}>
            {/* LOGO SELECTION  */}
            <View style={styles.logoContainer}>
                <Text style={styles.logo}>Saron</Text>
                <Text style={styles.subtitle}>WORK TOGETHER</Text>
            </View>

            {/* language buttons  */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleLanguageSelect('en')}
                >
                    <Text style={styles.buttonText}>English</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleLanguageSelect('am')}
                >
                    <Text style={styles.buttonText}>አማርኛ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleLanguageSelect('ti')}
                >
                    <Text style={styles.buttonText}>ትግርኛ</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#fff', 
        padding: 20, 
        justifyContent: 'center',
    }, 
    logoContainer: {
        alignItems: 'center', 
        marginBottom: 50
    },
    logo: {
        fontSize: 40, 
        fontWeight: 'bold', 
        color: '#5eaaa8',
    }, 
    subtitle: {
        fontSize: 14, 
        color: '#666', 
        marginTop: 5, 
        letterSpacing: 2, 
    }, 
    buttonContainer: {
        paddingHorizontal: 20, 
    }, 
    button: {
        backgroundColor: '#5eaaa8', 
        padding: 15, 
        borderRadius: 8, 
        marginBottom: 15, 
        elevation: 2, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2}, 
        shadowOpacity: 0.25, 
        shadowRadius: 3.84,
    }, 
    buttonText: {
        color: '#fff', 
        textAlign: 'center', 
        fontSize: 18, 
        fontWeight: '600', 
    }
})

export default LanguageSelect;