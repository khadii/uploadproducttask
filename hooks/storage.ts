import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

const PRODUCTS_KEY = '@products';

export const saveProducts = async (products: Product[]): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(products);
    await AsyncStorage.setItem(PRODUCTS_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving products:', error);
    return false;
  }
};

export const loadProducts = async (): Promise<Product[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(PRODUCTS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

export const clearProducts = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(PRODUCTS_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing products:', error);
    return false;
  }
};