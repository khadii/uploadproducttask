import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { RootStackParamList, Product } from '@/types';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Alert } from 'react-native';

import { loadProductsAsync, saveProductsAsync, deleteProduct } from '../Redux/productsSlice';
import { showNotification, setEditingProduct } from '../Redux/uiSlice';
import Card from '../Card';
import Header from '../Header';

type ProductListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProductList'
>;

interface Props {
  navigation: ProductListScreenNavigationProp;
}

const ProductListScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const productLimit = useAppSelector((state) => state.ui.productLimit);

  useEffect(() => {
    dispatch(loadProductsAsync());
  }, []);

  useEffect(() => {
    dispatch(saveProductsAsync(products));

    if (products.length >= productLimit) {
      dispatch(
        showNotification(
          `Product limit reached! Maximum ${productLimit} products allowed.`
        )
      );
      Alert.alert(
        'Product Limit Reached',
        `You have reached the maximum of ${productLimit} products. Please delete some products to add more.`
      );
    }
  }, [products, productLimit]);

  const handleAddProduct = () => {
    if (products.length >= productLimit) {
      Alert.alert(
        'Limit Reached',
        `Cannot add more than ${productLimit} products. Please delete some products first.`
      );
      return;
    }
    dispatch(setEditingProduct(null));
    navigation.navigate('AddEditProduct');
  };

  const handleEditProduct = (product: Product) => {
    dispatch(setEditingProduct(product));
    navigation.navigate('AddEditProduct');
  };

  const handleDeleteProduct = (productId: string) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteProduct(productId));
            dispatch(showNotification('Product deleted successfully'));
          },
        },
      ]
    );
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
  };

  return (
    <View style={styles.container}>
      <Header
        title="My Products"
        rightIcon="add"
        onRightPress={handleAddProduct}
      />

      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to add your first product
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              Products: {products.length} / {productLimit}
            </Text>
          </View>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card
                product={item}
                onPress={handleProductPress}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statsText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
});

export default ProductListScreen;