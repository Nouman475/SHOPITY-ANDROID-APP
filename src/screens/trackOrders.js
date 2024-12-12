import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

import axios from 'axios';
import { useAuth } from '../context/authContext';

// Utility to format dates
const formatDate = (timestamp) => {
  if (timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return 'Unknown Date';
};

const TrackOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const { user } = useAuth(); // Assuming useAuth provides the user context

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !user._id) {
          throw new Error('User not found');
        }

        // Fetch orders from the backend
        const response = await axios.get(`http://192.168.33.101:1000/api/v3/allOrders/${user._id}`);
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Orders</Text>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={({ item: order }) => (
            <View key={order._id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.itemNames}>
                  <Text style={{ fontWeight: 'bold' }}>{order.cartItems.map((item) => item.itemName).join(', ')}</Text>
                </Text>
                <View style={styles.statusContainer}>
                  <Text style={[styles.status, { color: order.isShipped ? 'green' : 'red' }]}>
                    {order.isShipped ? 'Shipped' : 'Not Shipped'}
                  </Text>
                </View>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.priceTag}>
                  $ {order.cartItems.reduce((total, item) => total + item.quantity * item.price, 0)}
                </Text>
              </View>
              <Text style={styles.orderDate}>
                <Text style={{ fontWeight: 'bold' }}>Order Date: </Text>{formatDate(order.createdAt)}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      ) : (
        <Text>No orders found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderCard: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemNames: {
    color: 'gray',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontWeight: 'bold',
  },
  priceContainer: {
    marginTop: 10,
  },
  priceTag: {
    fontWeight: 'bold',
    color: 'green',
  },
  orderDate: {
    marginTop: 10,
    color: 'red',
  },
});

export default TrackOrders;
