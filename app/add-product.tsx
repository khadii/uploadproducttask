import React, { useState, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { ProductFormData } from '../types';
import ProductForm from '@/components/ProductForm';
import { updateProduct, addProduct } from '@/components/Redux/productsSlice';
import { showNotification, clearEditingProduct } from '@/components/Redux/uiSlice';
import Header from '@/components/Header';



export default function AddEditProductScreen() {
  const dispatch = useAppDispatch();
  const editingProduct = useAppSelector((state) => state.ui.editingProduct);
  const [isLoading, setIsLoading] = useState(false);
  const hasNavigated = useRef(false); // Prevent double navigation

  const handleSubmit = async (productData: ProductFormData) => {
    if (isLoading || hasNavigated.current) return;
    
    setIsLoading(true);

    try {
      if (editingProduct) {
        const updatedProduct = {
          ...editingProduct,
          name: productData.name,
          price: typeof productData.price === 'string' 
            ? parseFloat(productData.price) 
            : productData.price,
          imageUri: productData.imageUri,
          status: productData.status || editingProduct.status,
        };
        dispatch(updateProduct(updatedProduct));
        dispatch(showNotification('Product updated successfully'));
      } else {
        dispatch(addProduct(productData));
        dispatch(showNotification('Product added successfully'));
      }

      // Mark that we've navigated to prevent multiple navigation calls
      hasNavigated.current = true;
      
      // Navigate back after a short delay
      setTimeout(() => {
        dispatch(clearEditingProduct());
        router.replace('/');
      }, 500);
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Error', 'Failed to save product. Please try again.');
      setIsLoading(false);
      hasNavigated.current = false;
    }
  };

  const handleBack = () => {
    if (isLoading) return;
    
    Alert.alert(
      'Discard Changes?',
      'Are you sure you want to go back? Any unsaved changes will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Discard', 
          style: 'destructive',
          onPress: () => {
            dispatch(clearEditingProduct());
            router.back();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        showBack={true}
        onBackPress={handleBack}
      />
      <ProductForm
        initialData={editingProduct}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});