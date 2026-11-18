import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ category = 'All', search = '' } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (category && category !== 'All') params.category = category;
      if (search && search.trim()) params.search = search.trim();

      const response = await apiClient.get('/products', { params });
      return response.data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load products');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    selectedCategory: 'All',
    searchQuery: '',
    loading: false,
    error: null
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedCategory, setSearchQuery } = productSlice.actions;
export default productSlice.reducer;
