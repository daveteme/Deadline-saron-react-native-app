
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { loginUser } from '../features/authorization/authSlice';

const Login = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();  // Changed from dispatchEvent to dispatch
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async () => {
    if(!formData.email || !formData.password) {
      alert('Please fill in all fields')
      return;
    }

    try {
      setIsLoading(true);
      const resultAction = await dispatch(loginUser(formData));
      if(loginUser.fulfilled.match(resultAction)) {
        navigation.navigate('MainApp');
      } else {
        alert(resultAction.payload || 'Login failed');
      }
    } catch (error) {
      alert ('An unexpected error occurred');
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

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? t('signingIn') : t('login')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={styles.linkContainer}
        >
          <Text style={styles.link}>{t('needAccount')}</Text>
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

export default Login;