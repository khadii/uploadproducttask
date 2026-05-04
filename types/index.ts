import { ParamListBase } from '@react-navigation/native';

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUri: string;
  status: 'active' | 'sold_out' | 'draft';
  createdAt: string;
}

export interface ProductFormData {
  name: string;
  price: number | string;
  imageUri: string;
  status?: 'active' | 'sold_out' | 'draft';
}

export interface RootStackParamList extends ParamListBase {
  ProductList: undefined;
  AddEditProduct: undefined;
  ProductDetail: { product: Product };
}

export interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

export interface UIState {
  editingProduct: Product | null;
  showNotification: boolean;
  notificationMessage: string;
  productLimit: number;
}

export interface ValidationErrors {
  name?: string;
  price?: string;
  imageUri?: string;
  status?: string;  // Make sure this line exists
}