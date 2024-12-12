import React, { 
    createContext, 
    useState, 
    useContext, 
    useEffect, 
    useCallback 
  } from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import axios from 'axios';
  
  // Create the AuthContext
  const AuthContext = createContext({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    login: async () => {},
    logout: async () => {},
    refreshToken: async () => {},
  });
  
  // AuthProvider Component
  export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
  
    // Load user from storage on initial app load
    const loadStoredUser = useCallback(async () => {
      try {
        setIsLoading(true);
        const storedUser = await AsyncStorage.getItem('user');
        const accessToken = await AsyncStorage.getItem('accessToken');
  
        if (storedUser && accessToken) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    }, []);
  
  
    const logout = async () => {
      try {
        // Clear stored user and tokens
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('accessToken');
    
        // Reset state
        setUser(null);
        setIsAuthenticated(false);
      } catch (error) {
        console.error('Logout error:', error);
      }
    };
    
  
   
  
    // Set up axios interceptors
    useEffect(() => {
      const interceptor = axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
  
          // If unauthorized and not already retried
          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
              
              return axios(originalRequest);
            } catch (refreshError) {
              return Promise.reject(refreshError);
            }
          }
  
          return Promise.reject(error);
        }
      );
  
      // Initial user load
      loadStoredUser();
  
      // Cleanup interceptor
      return () => {
        axios.interceptors.response.eject(interceptor);
      };
    }, [loadStoredUser]);
  
    // Context value
    const value = {
      isLoading,
      isAuthenticated,
      setIsAuthenticated,
      user,
      setUser,
      logout,
    };
  
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  // Custom hook to use auth context
  export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
  };
  
  // Higher-order component for protected routes
  export const withAuth = (WrappedComponent) => {
    return (props) => {
      const { isAuthenticated, isLoading } = useAuth();
      
      if (isLoading) {
        return <ActivityIndicator size="large" />;
      }
      
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" />;
      }
      
      return <WrappedComponent {...props} />;
    };
  };