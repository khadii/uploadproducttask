import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { RootStackParamList, ProductFormData } from '@/types';
import { updateProduct, addProduct } from '../Redux/productsSlice';
import { showNotification, clearEditingProduct } from '../Redux/uiSlice';
import Header from '../Header';
import ProductForm from '../ProductForm';

type AddEditProductScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddEditProduct'
>;

interface Props {
  navigation: AddEditProductScreenNavigationProp;
}

const AddEditProductScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const editingProduct = useAppSelector((state) => state.ui.editingProduct);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (productData: ProductFormData) => {
    setIsLoading(true);

    try {
      if (editingProduct) {
        // Convert price to number if it's a string
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

      setTimeout(() => {
        dispatch(clearEditingProduct());
        navigation.goBack();
      }, 500);
    } catch (error) {
      Alert.alert('Error', 'Failed to save product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    dispatch(clearEditingProduct());
    navigation.goBack();
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default AddEditProductScreen;