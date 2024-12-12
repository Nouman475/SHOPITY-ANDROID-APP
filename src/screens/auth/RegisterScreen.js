import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/authContext';

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setIsAuthenticated, setUser } = useAuth();

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
  };

  const handleRegister = async () => {
    // Comprehensive validation
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        'Invalid Password', 
        'Password must be at least 8 characters long and contain:\n' +
        '- One uppercase letter\n' +
        '- One lowercase letter\n' +
        '- One number'
      );
      return;
    }

    setIsLoading(true);

    try {
      // Make registration API call
      const response = await axios.post('http://192.168.33.101:1000/api/v1/register', {
        fullName,
        email,
        password
      });

      // Store tokens and user info
      await AsyncStorage.setItem('accessToken', response.data.accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

      // Success alert and navigation
      Alert.alert(
        "Success", 
        `Welcome, ${fullName}!`, 
      );
      setIsAuthenticated(true)
      setUser(response.data.user)
    } catch (error) {
      // Comprehensive error handling
      if (error.response) {
        // Server responded with an error
        switch (error.response.status) {
          case 400:
            Alert.alert(
              "Registration Error", 
              error.response.data.message || "User already exists or invalid data"
            );
            break;
          case 500:
            Alert.alert("Error", "Server error. Please try again later.");
            break;
          default:
            Alert.alert("Error", "An unexpected error occurred.");
        }
      } else if (error.request) {
        // Request made but no response received
        Alert.alert("Error", "No response from server. Check your internet connection.");
      } else {
        // Error in setting up the request
        Alert.alert("Error", "Error setting up registration request.");
      }
      console.error("Registration Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://res.cloudinary.com/da9ezk2tb/image/upload/v1733659557/Shopity_zajrjq.jpg',
      }} // Replace with your image URL
      style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Create an Account</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#aaa"
          value={fullName}
          onChangeText={text => setFullName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')} // Navigate to Login
        >
          <Text style={styles.buttonText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '90%', // Adjusted to make it visually centered
    maxWidth: 400, // Optional: Ensure inputs aren't too wide on large screens
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  button: {
    width: '90%', // Matches input width
    maxWidth: 400, // Consistency with input field width
    height: 50,
    backgroundColor: '#D1A382',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: 15,
    width: '90%', // Matches button width
    maxWidth: 400, // Optional: Keep consistent width
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default RegisterScreen;