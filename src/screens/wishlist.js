import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useWishlist } from '../context/wishlistContext';


const emptyWishlistIllustration = 'https://cdni.iconscout.com/illustration/premium/thumb/empty-state-illustration-download-in-svg-png-gif-file-formats--post-pack-design-development-illustrations-1800926.png';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist(); // Access context

  const handleRemove = (productId) => {
    removeFromWishlist(productId); // Update state and AsyncStorage
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {wishlistItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Image
            source={{ uri: emptyWishlistIllustration }}
            style={styles.illustration}
          />
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
          <Text style={styles.instruction}>Start adding items to your wishlist.</Text>
        </View>
      ) : (
        <View style={styles.itemsList}>
          {wishlistItems.map((item) => (
            <View key={item.product._id} style={styles.itemCard}>
              <Image
                source={{ uri: item.product.mainImageUrl }}
                style={styles.productImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.product.itemName}</Text>
                <Text style={styles.itemPrice}>${item.product.price}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemove(item.product._id)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  removeButton: {
    backgroundColor: '#ff4d4f',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
