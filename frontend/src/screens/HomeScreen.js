import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  setSelectedCategory,
  setSearchQuery
} from '../store/slices/productSlice';
import { fetchCart, addItemToCart } from '../store/slices/cartSlice';
import { toggleWishlistItem } from '../store/slices/authSlice';
import ProductCard from '../components/ProductCard';
import ToastBanner from '../components/ToastBanner';
import { COLORS, RADIUS, SPACING } from '../theme/theme';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Fitness', 'Accessories'];

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: products, selectedCategory, searchQuery, loading } = useSelector(
    (state) => state.products
  );

  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 2200);
  };

  useEffect(() => {
    dispatch(fetchCart());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchProducts({ category: selectedCategory, search: searchQuery }));
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchProducts({ category: selectedCategory, search: searchQuery }));
    setRefreshing(false);
  }, [selectedCategory, searchQuery]);

  const handleAddToCart = async (product) => {
    await dispatch(addItemToCart({ productId: product._id, quantity: 1 }));
    showToast(`Added "${product.name}" to cart`);
  };

  const handleToggleWishlist = (productId) => {
    dispatch(toggleWishlistItem(productId));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ToastBanner visible={toast.visible} message={toast.message} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Shopper'}</Text>
          <Text style={styles.headerTitle}>Discover ShopSphere</Text>
        </View>
        <TouchableOpacity
          style={styles.wishlistHeaderBtn}
          onPress={() => navigation.navigate('Wishlist')}
        >
          <Ionicons name="heart-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search headphones, watches, coats..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={(text) => dispatch(setSearchQuery(text))}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => dispatch(setSearchQuery(''))}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Pills */}
      <View style={styles.categoryBarWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[styles.categoryChip, active && styles.categoryChipActive]}
                onPress={() => dispatch(setSelectedCategory(category))}
              >
                <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Product Grid */}
      {loading && products.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="search" size={44} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or switching categories.
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <ProductCard
              product={item}
              index={index}
              isWishlisted={user?.wishlist?.includes(item._id)}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
              onAddToCart={() => handleAddToCart(item)}
              onToggleWishlist={() => handleToggleWishlist(item._id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md
  },
  greeting: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  wishlistHeaderBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary
  },
  categoryBarWrapper: {
    marginVertical: SPACING.md
  },
  categoryScroll: {
    paddingHorizontal: SPACING.md,
    gap: 8
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  categoryChipTextActive: {
    color: '#FFFFFF'
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md
  },
  listContent: {
    paddingBottom: 28
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyBox: {
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 32
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 12
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4
  }
});
