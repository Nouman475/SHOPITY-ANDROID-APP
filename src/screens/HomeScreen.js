import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    {
      name: 'Electronics',
      image:
        'https://www.olx.com.pk/assets/electronics-home-appliances.46e034dd8adca44625c2c70e4d1b5984.png',
    },
    {
      name: 'Fashion',
      image:
        'https://www.olx.com.pk/assets/fashion-beauty.dd2cf7638c29b0e5c084a6673dd94dd7.png',
    },
    {
      name: 'Home',
      image:
        'https://www.olx.com.pk/assets/property-for-sale.e3a00dbfdaa69fe5f713665f1069502f.png',
    },
    {
      name: 'Vehicle',
      image:
        'https://www.olx.com.pk/assets/vehicles.29fb808d5118f0db56f68a39ce5392e2.png',
    },
    {
      name: 'Toys',
      image:
        'https://www.olx.com.pk/assets/kids.cd8d8864804f1c35dd6a7df68268a48d.png',
    },
    {
      name: 'Books',
      image:
        'https://www.olx.com.pk/assets/books-sports-hobbies.6fee8d841b332d65a10f050f4a2ee1c8.png',
    },
    {
      name: 'Bikes',
      image:
        'https://www.olx.com.pk/assets/bikes.4dcd02c49b2b83aa5b4d629d1e2b383e.png',
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://192.168.33.101:1000/api/v2/getProducts`,
        );
        setProducts(response.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const ProductCard = ({product}) => (
    <View style={styles.productCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: product.mainImageUrl}}
          style={styles.productImage}
          resizeMode="cover"
        />
        {product.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{product.discount}% OFF</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.itemName}
        </Text>
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Product', { productId: product._id })} style={styles.shopButton}>
          <Icon name="cart-outline" size={18} color="white" />
          <Text style={styles.shopButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={{backgroundColor: 'white'}}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopity</Text>
        <View style={styles.headerIcons}>
          <Icon
          onPress={() => navigation.navigate('Wishlist')}
            name="heart"
            color="red"
            size={30}
            style={styles.headerIconMargin}
          />
          <Icon name="cart" onPress={() => navigation.navigate('Cart')} color="orange" size={30} />
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Icon name="search" color="#888" size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
        />
        <MaterialIcon
          name="tune"
          color="#333"
          size={24}
          style={styles.filterButton}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryButton}>
            <Image
              source={{uri: category.image}}
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return loading ? (
    <View style={[styles.loader, styles.whiteBackground]}>
      <Text>Loading...</Text>
    </View>
  ) : (
    <View style={styles.whiteBackground}>
      <FlatList
        data={products}
        renderItem={({item}) => <ProductCard product={item} />}
        keyExtractor={item => item._id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.productsContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerTitle: {fontSize: 22, fontWeight: 'bold'},
  headerIcons: {flexDirection: 'row'},
  headerIconMargin: {marginRight: 15},
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
  },
  searchInput: {flex: 1, marginLeft: 10},
  filterButton: {marginLeft: 10},
  categoriesContainer: {padding: 10},
  categoryButton: {alignItems: 'center', marginRight: 10},
  categoryImage: {width: 60, height: 60, borderRadius: 30},
  categoryText: {marginTop: 5, fontSize: 12},
  productsContentContainer: {padding: 10, backgroundColor: 'white'},
  productRow: {justifyContent: 'space-between', backgroundColor: 'white'},
  productCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    margin: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '90%',
    height: '100%',
    borderRadius: 10,
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 10,
    alignItems: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6c63ff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
  },

  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  whiteBackground: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default HomeScreen;
