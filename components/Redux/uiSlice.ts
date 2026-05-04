import { Product, UIState } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { UIState, Product } from '../types';

const initialState: UIState = {
  editingProduct: null,
  showNotification: false,
  notificationMessage: '',
  productLimit: 5,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setEditingProduct: (state, action: PayloadAction<Product | null>) => {
      state.editingProduct = action.payload;
    },
    clearEditingProduct: (state) => {
      state.editingProduct = null;
    },
    showNotification: (state, action: PayloadAction<string>) => {
      state.showNotification = true;
      state.notificationMessage = action.payload;
    },
    hideNotification: (state) => {
      state.showNotification = false;
      state.notificationMessage = '';
    },
    setProductLimit: (state, action: PayloadAction<number>) => {
      state.productLimit = action.payload;
    },
  },
});

export const {
  setEditingProduct,
  clearEditingProduct,
  showNotification,
  hideNotification,
  setProductLimit,
} = uiSlice.actions;
export default uiSlice.reducer;