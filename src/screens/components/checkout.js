import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ToastAndroid, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/authContext';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useCart } from '../../context/cartContext';

const Checkout = ({ cartItems }) => {
  const { user } = useAuth();
  const { clearCart } = useCart();
  const [addresses, setAddresses] = useState(user.addresses || []);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [contactDetails, setContactDetails] = useState({
    email: user.email || '',
    phone: '',
  });
  const [showModal, setShowModal] = useState(false); // Modal for adding new address
  const [newAddress, setNewAddress] = useState(''); // New address input
  const [loading, setLoading] = useState(false);

  // Handle adding a new address
  const handleAddAddress = async () => {
    if (!newAddress.trim()) {
      alert('Please enter an address');
      return;
    }
    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);
    user.addresses = updatedAddresses;
    setShowModal(false);
    setNewAddress('');
  };

  // Handle placing an order
  const handleOrder = async () => {
    setLoading(true);

    // Validation
    if (!selectedAddress || !paymentMethod || !contactDetails.email || !contactDetails.phone) {
      ToastAndroid.show('Please fill all the fields (Address, Email, Phone, Payment)', ToastAndroid.SHORT);
      setLoading(false);
      return;
    }

    const formData = {
      cartItems,
      orderedBy: user._id,
      paymentMethod,
      address: selectedAddress,
      customerEmail: contactDetails.email,
      customerPhone: contactDetails.phone,
    };

    console.log("Order Form Data:", formData);

    try {
      const response = await axios.post("http://192.168.33.101:1000/api/v3/createOrder", formData);
      if (response.status === 201) {
        ToastAndroid.show('Order placed successfully', ToastAndroid.SHORT);
        clearCart(); // Clear the cart after successful order
        setLoading(false);
      } else {
        ToastAndroid.show('Error while placing order', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      ToastAndroid.show('Error while placing order', ToastAndroid.SHORT);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Checkout</Text>

      {/* Address Selection */}
      <Text style={styles.label}>Select Address:</Text>
      <Picker
        selectedValue={selectedAddress}
        onValueChange={(value) => {
          if (value === 'new') {
            setShowModal(true); // Open modal for adding address
          } else {
            setSelectedAddress(value);
          }
        }}
        style={styles.picker}
      >
        {addresses.map((address, index) => (
          <Picker.Item label={address} value={address} key={index} />
        ))}
        <Picker.Item label=" + Add New Address" value="new" />
      </Picker>

      {/* Show modal for adding a new address */}
      {showModal && (
        <Modal visible={true} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeading}>Add New Address</Text>
              <TextInput
                value={newAddress}
                onChangeText={setNewAddress}
                style={styles.input}
                placeholder="Enter new address"
              />
              <TouchableOpacity onPress={handleAddAddress} style={styles.button}>
                <Text style={styles.buttonText}>Save Address</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Payment Method */}
      <Text style={styles.label}>Payment Method:</Text>
      <Picker
        selectedValue={paymentMethod}
        onValueChange={(value) => setPaymentMethod(value)}
        style={styles.picker}
      >
        <Picker.Item label="Credit Card" value="credit" />
        <Picker.Item label="Cash on Delivery" value="cod" />
        <Picker.Item label="Google Pay" value="gpay" />
      </Picker>

      {/* Contact Details */}
      <Text style={styles.label}>Email:</Text>
      <TextInput
        value={contactDetails.email}
        onChangeText={(text) => setContactDetails({ ...contactDetails, email: text })}
        style={styles.input}
        placeholder="Enter email"
      />

      <Text style={styles.label}>Phone:</Text>
      <TextInput
        value={contactDetails.phone}
        onChangeText={(text) => setContactDetails({ ...contactDetails, phone: text })}
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
      />

      <TouchableOpacity onPress={handleOrder} style={styles.button}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Place Order</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 5, backgroundColor: '#fff', borderRadius: 10, marginTop: 20 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: "center" },
  label: { fontSize: 16, marginVertical: 5, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
  picker: { borderColor: '#ccc', borderWidth: 1, borderRadius: 5, marginBottom: 10 },
  button: { backgroundColor: '#813beb', padding: 15, borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  modalHeading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  cancelButton: { backgroundColor: '#f44336', padding: 10, borderRadius: 5, marginTop: 10 },
});

export default Checkout;
