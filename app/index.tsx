
import Card from '@/components/Card';
import { loadProductsAsync, saveProductsAsync, deleteProduct } from '@/components/Redux/productsSlice';
import { setEditingProduct, showNotification } from '@/components/Redux/uiSlice';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { Product } from '../types';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Text, Alert } from 'react-native';
import Header from '@/components/Header';

export default function ProductListScreen() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const productLimit = useAppSelector((state) => state.ui.productLimit);
  const isInitialMount = useRef(true);
  const hasShownLimitAlert = useRef(false);

  useEffect(() => {
    dispatch(loadProductsAsync());
  }, []);

  useEffect(() => {
    // Skip the first save on initial load
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    dispatch(saveProductsAsync(products));
  }, [products]);

  const handleAddProduct = () => {
    if (products.length >= productLimit) {
      // Show alert only when trying to add at limit
      Alert.alert(
        'Limit Reached',
        `Cannot add more than ${productLimit} products. Please delete some products first.`
      );
      return;
    }
    dispatch(setEditingProduct(null));
    router.push('/add-product');
  };

  const handleEditProduct = (product: Product) => {
   
    dispatch(setEditingProduct(product));
    router.push('/add-product');
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
            
            if (products.length - 1 < productLimit) {
              hasShownLimitAlert.current = false;
            }
          },
        },
      ]
    );
  };

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: '/product-detail',
      params: { product: JSON.stringify(product) }
    });
  };


  useEffect(() => {
    if (products.length >= productLimit && !hasShownLimitAlert.current) {
      hasShownLimitAlert.current = true;
      dispatch(
        showNotification(
          `Product limit reached! Maximum ${productLimit} products allowed.`
        )
      );
    }
    
    // Reset flag when below limit
    if (products.length < productLimit) {
      hasShownLimitAlert.current = false;
    }
  }, [products.length, productLimit]);

  const renderItem = ({ item }: { item: Product }) => (
    <Card
      product={item}
      onPress={handleProductPress}
      onEdit={handleEditProduct}
      onDelete={handleDeleteProduct}
    />
  );

  const ListFooter = () => {
    if (products.length === 0) return null;
    
    return (
      <View style={styles.listFooter}>
        <Text style={styles.footerText}>
          Total {products.length} product{products.length !== 1 ? 's' : ''}
        </Text>
      </View>
    );
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
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            ListFooterComponent={ListFooter}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    paddingVertical: 8,
    paddingBottom: 20,
  },
  listFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
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
});