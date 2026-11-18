import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/cart');
      return response.data.items;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load cart');
    }
  }
);

export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/cart', { productId, quantity });
      return response.data.items;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not add item');
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/cart/${productId}`, { quantity });
      return response.data.items;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not update quantity');
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  'cart/removeItemFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/cart/${productId}`);
      return response.data.items;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not remove item');
    }
  }
);

export const clearUserCart = createAsyncThunk(
  'cart/clearUserCart',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.delete('/cart');
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    resetCartState: (state) => {
      state.items = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(clearUserCart.fulfilled, (state) => {
        state.items = [];
      });
  }
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
