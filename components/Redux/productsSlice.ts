import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductFormData, ProductsState } from '@/types';
import { loadProducts, saveProducts } from '@/hooks/storage';

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

export const loadProductsAsync = createAsyncThunk(
  'products/load',
  async (): Promise<Product[]> => {
    const products = await loadProducts();
    return products;
  }
);

export const saveProductsAsync = createAsyncThunk(
  'products/save',
  async (products: Product[]): Promise<Product[]> => {
    await saveProducts(products);
    return products;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<ProductFormData>) => {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: action.payload.name,
        price: typeof action.payload.price === 'string' 
          ? parseFloat(action.payload.price) 
          : action.payload.price,
        imageUri: action.payload.imageUri, // Ensure imageUri is stored
        status: action.payload.status || 'active',
        createdAt: new Date().toISOString(),
      };
      state.items.push(newProduct);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(p => p.id !== action.payload);
    },
    clearAllProducts: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProductsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProductsAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(loadProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load products';
      })
      .addCase(saveProductsAsync.fulfilled, (state, action) => {
        // Only update if items are different to prevent unnecessary re-renders
        if (JSON.stringify(state.items) !== JSON.stringify(action.payload)) {
          state.items = action.payload;
        }
      });
  },
});

export const { addProduct, updateProduct, deleteProduct, clearAllProducts } = productsSlice.actions;
export default productsSlice.reducer;