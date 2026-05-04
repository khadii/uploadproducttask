import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppDispatch } from '../hooks/hooks';
import { Product } from '../types';
import { deleteProduct } from '@/components/Redux/productsSlice';
import { setEditingProduct, showNotification } from '@/components/Redux/uiSlice';
import Tag from '@/components/Tag';
import Header from '@/components/Header';
import Button from '@/components/Button';

export default function ProductDetailScreen() {
  const params = useLocalSearchParams();
  const product: Product = JSON.parse(params.product as string);
  const dispatch = useAppDispatch();

  const handleEdit = () => {
    dispatch(setEditingProduct(product));
    router.push('/add-product');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteProduct(product.id));
            dispatch(showNotification('Product deleted successfully'));
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/');
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Product Details"
        showBack={true}
        onBackPress={handleBack}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {product.imageUri && (
          <Image source={{ uri: product.imageUri }} style={styles.image} />
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>

          <View style={styles.statusContainer}>
            {product.status && <Tag text={product.status} />}
          </View>

          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>
              Added on: {new Date(product.createdAt).toLocaleDateString()}
            </Text>
            <Text style={styles.metaText}>Product ID: {product.id}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionsContainer}>
        <Button
          title="Edit Product"
          onPress={handleEdit}
          style={styles.actionButton}
        />
        <Button
          title="Delete Product"
          variant="danger"
          onPress={handleDelete}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: 16,
  },
  statusContainer: {
    marginBottom: 20,
  },
  metaContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  actionsContainer: {
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    flex: 1,
  },
});