// screens/Signup.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { registerUser } from '../features/authorization/authSlice';


const Signup = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSignup = async () => {
    try {
      setIsLoading(true);

      // Basic validation
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error(t('fillAllFields'));
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error(t('passwordsDontMatch'));
      }

      // Email format Validation 
      
      // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // if(!emailRegex.test(formData.email)) {
      //   throw new Error(t('invalidEmail'));
      // }
         
      // // Password strength validation
      // // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      // // if (!passwordRegex.test(formData.password)) {
      // //   throw new Error(t('weakPassword'));
      // // }

      // // Name length validation
      // if (formData.name.length < 3) {
      //   throw new Error(t('nameTooShort'));
      // }

      // Here you would typically make an API call to register the user
      // For now, we'll just simulate success
      // dispatch(loginSuccess({ email: formData.email, name: formData.name })); // old code 
      dispatch(registerUser({
        email: formData.email, 
        name: formData.name, 
        password: formData.password
      }));
      navigation.navigate('MainApp');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.header}>
        <Text style={styles.logo}>Saron</Text>
        <Text style={styles.subtitle}>WORK TOGETHER</Text>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder={t('name')}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder={t('email')}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder={t('password')}
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder={t('confirmPassword')}
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? t('creatingAccount') : t('createAccount')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.linkContainer}
        >
          <Text style={styles.link}>{t('alreadyHaveAccount')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#5eaaa8',
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 2,
    color: '#666',
    marginTop: 5,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#5eaaa8',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#94c5c4',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    color: '#5eaaa8',
    fontSize: 16,
  }
});

export default Signup;