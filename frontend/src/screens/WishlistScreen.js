import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import apiClient from '../api/client';
import { toggleWishlistItem } from '../store/slices/authSlice';
import { addItemToCart } from '../store/slices/cartSlice';
import ToastBanner from '../components/ToastBanner';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../theme/theme';

export default function WishlistScreen({ navigation }) {
  const dispatch = useDispatch();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const loadWishlist = async () => {
    try {
      const res = await apiClient.get('/users/wishlist');
      setWishlist(res.data.wishlist);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (productId) => {
    await dispatch(toggleWishlistItem(productId));
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
  };

  const handleMoveToCart = async (product) => {
    await dispatch(addItemToCart({ productId: product._id, quantity: 1 }));
    setToastMsg(`Moved "${product.name}" to cart`);
    setTimeout(() => setToastMsg(''), 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ToastBanner visible={Boolean(toastMsg)} message={toastMsg} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Saved Wishlist</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="heart-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No saved items yet</Text>
              <Text style={styles.emptySub}>Tap the heart icon on any product to save it here.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.cartBtn}
                    onPress={() => handleMoveToCart(item)}
                  >
                    <Text style={styles.cartBtnText}>Add to Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemove(item._id)}>
                    <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: SPACING.md },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 12,
    marginBottom: 12,
    ...SHADOWS.card
  },
  image: { width: 82, height: 82, borderRadius: RADIUS.md },
  info: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  name: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  price: { fontSize: 15, fontWeight: '800', color: COLORS.accent },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cartBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.sm
  },
  cartBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  emptyBox: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginTop: 10 },
  emptySub: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 }
});
