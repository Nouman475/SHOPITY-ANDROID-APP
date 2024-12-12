import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ScrollView, 
  FlatList, 
  Image, 
  TextInput 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useCart } from '../context/cartContext';
import { useWishlist } from '../context/wishlistContext';

const ProductPreview = ({ route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);


  const {addToCart} = useCart()
  const {addToWishlist , getAllWishlistItems, removeFromWishlist} = useWishlist()

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.33.101:1000/api/v2/getProduct/${productId}`);
        setProduct(response.data);
        
        // Check if the product is in the wishlist
        const wishlistItems = await getAllWishlistItems();
        const isInWishlist = wishlistItems.some(item => item.product._id === response.data.product._id);
        setIsFavorite(isInWishlist);
        
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error('Error fetching product details:', err);
      }
    };

    fetchProductDetails();
  }, [productId,addToWishlist,removeFromWishlist]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>Error loading product details</Text>
      </View>
    );
  }

  const { itemName, price, category, description, isInStock, mainImageUrl, secondaryImageUrls, reviews } = product.product;

  // Calculate average rating
  const averageRating = reviews.length 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? 'star' : 'star-o'}
          size={20}
          color="#FFD700"
        />
      );
    }
    return stars;
  };

  const handleStarPress = (value) => {
    setNewRating(value);
  };

  const handleSubmitReview = async () => {
    if (!newRating || !newReview.trim()) {
      alert('Please provide a rating and review');
      return;
    }
    try {
      const updatedReviews = [
        ...reviews,
        {
          rating: newRating,
          review: newReview,
          timestamp: new Date(),
        },
      ];
      setProduct({
        ...product,
        product: {
          ...product.product,
          reviews: updatedReviews,
        },
      });
      setNewReview('');
      setNewRating(0);
      alert('Review submitted!');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const renderImage = ({ item }) => (
    <Image source={{ uri: item }} style={styles.image} />
  );

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <Text style={styles.reviewText}>{item.review}</Text>
      <View style={styles.starsRow}>{renderStars(item.rating)}</View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.detailsContainer}>
        {/* Badge */}
        <Text style={[styles.badge, isInStock ? styles.inStockBadge : styles.outOfStockBadge]}>
          {isInStock ? 'In Stock' : 'Out of Stock'}
        </Text>
        <View style={styles.topStarRow}>
          {renderStars(averageRating)}
          <Text style={styles.averageRatingText}>({averageRating.toFixed(1)})</Text>
        </View>

        {/* Image Carousel */}
        <FlatList
          data={[mainImageUrl, ...secondaryImageUrls]}
          renderItem={renderImage}
          keyExtractor={(item, index) => `image-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageCarousel}
        />

        {/* Product Name */}
        <Text style={styles.productName}>{itemName}</Text>

        {/* Price */}
        <Text style={styles.productPrice}>${price}</Text>

        {/* Category */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Category:</Text>
          <Text style={styles.detailValue}>{category}</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Description:</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addToCartButton} onPress={()=>{addToCart(product)}}>
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.buyNowButton} 
            onPress={() => {
              if (isFavorite) {
                // Remove from wishlist using product ID
                removeFromWishlist(product.product._id);
                setIsFavorite(false);
              } else {
                addToWishlist(product);
                setIsFavorite(true);
              }
            }}
          >
            <Icon
              name={isFavorite ? "heart" : "heart-o"}
              size={24} 
              color={isFavorite ? "red" : "gray"} 
            />
          </TouchableOpacity>
        </View>

        {/* Reviews Section */}
        <View style={styles.reviewsContainer}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <FlatList
            data={reviews}
            renderItem={renderReview}
            keyExtractor={(item, index) => `review-${index}`}
          />
          <View style={styles.addReviewContainer}>
            <Text style={styles.sectionSubtitle}>Leave a Review</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your review"
              value={newReview}
              onChangeText={setNewReview}
              multiline
            />
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                  <Icon
                    name={star <= newRating ? 'star' : 'star-o'}
                    size={30}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.submitReviewButton} onPress={handleSubmitReview}>
              <Text style={styles.buttonText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 10,
    elevation: 3,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 240,
    right: 20,
    zIndex:99999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  inStockBadge: {
    backgroundColor: '#28a745',
    color: '#fff',
  },
  outOfStockBadge: {
    backgroundColor: '#dc3545',
    color: '#fff',
  },
  imageCarousel: {
    marginBottom: 20,
  },
  image: {
    width: Dimensions.get('window').width * 0.9,
    height: 200,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 22,
    color: '#5c4699',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  detailValue: {
    flex: 1,
  },
  descriptionContainer: {
    marginVertical: 15,
  },
  descriptionLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  descriptionText: {
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addToCartButton: {
    flex: 8,
    backgroundColor: '#5c4699',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  buyNowButton: {
    flex:1,
    borderStyle:"solid",
    borderWidth:1,
    padding: 10,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent:"center",
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  reviewAuthor: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reviewText: {
    color: '#555',
  },
  addReviewContainer: {
    marginTop: 20,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  submitReviewButton: {
    backgroundColor: '#5c4699',
    padding: 15, 
    borderRadius: 5,
    alignItems: 'center',
  },
  topStarRow:{
    position: 'absolute',
    top: 290,
    right: 20,
    zIndex:99999,
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  averageRatingText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#555',
  },
};

export default ProductPreview;
