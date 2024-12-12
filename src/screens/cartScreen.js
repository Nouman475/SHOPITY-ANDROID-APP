import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useCart } from '../context/cartContext';
import Checkout from './components/checkout';

const emptyCartIllustration =
  'https://cdni.iconscout.com/illustration/premium/thumb/empty-state-illustration-download-in-svg-png-gif-file-formats--post-pack-design-development-illustrations-1800926.png';

export default function CartScreen() {
  const { cartItems, removeFromCart } = useCart();
  const [quantities, setQuantities] = useState({});
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    // Initialize quantities for each product
    const initialQuantities = {};
    cartItems.forEach((item) => {
      initialQuantities[item.product._id] = 1;
    });
    setQuantities(initialQuantities);
  }, [cartItems]);

  useEffect(() => {
    // Calculate the grand total whenever quantities or cartItems change
    const total = cartItems.reduce((sum, item) => {
      const productId = item.product._id;
      const price = item.product.price;
      const quantity = quantities[productId] || 1;
      return sum + price * quantity;
    }, 0);
    setGrandTotal(total);
  }, [quantities, cartItems]);

  const increaseQuantity = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: prev[productId] + 1,
    }));
  };

  const decreaseQuantity = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: prev[productId] > 1 ? prev[productId] - 1 : 1,
    }));
  };

  const calculateSubtotal = (price, productId) => {
    return price * (quantities[productId] || 1);
  };

  const ShoppingSummary = () => (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>Shopping Summary</Text>
      {cartItems.map((item) => {
        const product = item.product;
        const quantity = quantities[product._id] || 1;
        return (
          <View key={product._id} style={styles.summaryItem}>
            <Text style={styles.summaryItemText}>
              {product.itemName} x {quantity} = ${calculateSubtotal(product.price, product._id)}
            </Text>
          </View>
        );
      })}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Grand Total: ${grandTotal}</Text>
      </View>
    </View>
  );

  const formattedCartItems = cartItems.map(item => ({
    itemName: item.product.itemName,
    price: item.product.price,
    quantity: quantities[item.product._id] || 1, 
    mainImageUrl: item.product.mainImageUrl,
  }));
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Image source={{ uri: emptyCartIllustration }} style={styles.illustration} />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.instruction}>Add items to your cart to see them here.</Text>
        </View>
      ) : (
        <View style={styles.itemsList}>
          {/* Cart Items */}
          {cartItems.map((item) => {
            const product = item.product;
            return (
              <View key={product._id} style={styles.itemCard}>
                <Image source={{ uri: product.mainImageUrl }} style={styles.productImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{product.itemName}</Text>
                  <Text style={styles.itemPrice}>${product.price}</Text>

                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => decreaseQuantity(product._id)}
                    >
                      <Text style={styles.buttonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantities[product._id] || 1}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => increaseQuantity(product._id)}
                    >
                      <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.subtotalText}>
                    Subtotal: ${calculateSubtotal(product.price, product._id)}
                  </Text>

                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeFromCart(product._id)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
          {/* Shopping Summary */}
          <ShoppingSummary />
          <Checkout cartItems={formattedCartItems} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  summaryCard: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign:"center"
  },
  summaryItem: {
    marginBottom: 5,
  },
  summaryItemText: {
    fontSize: 16,
    color: '#555',
  },
  totalContainer: {
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 100,
  },
  illustration: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 16,
    color: '#777',
  },
  itemsList: {
    marginTop: 20,
  },
  itemCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 16,
    color: '#777',
    marginVertical: 5,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subtotalText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: '#ff4d4f',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
