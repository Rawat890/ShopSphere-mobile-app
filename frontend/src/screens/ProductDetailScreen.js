import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '../store/slices/cartSlice';
import { toggleWishlistItem } from '../store/slices/authSlice';
import AnimatedPressable from '../components/AnimatedPressable';
import ToastBanner from '../components/ToastBanner';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../theme/theme';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);

  const isWishlisted = user?.wishlist?.includes(product._id);

  const slideUp = useRef(new Animated.Value(30)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(slideUp, { toValue: 0, tension: 65, friction: 10, useNativeDriver: true })
    ]).start();
  }, []);

  const handleAdd = async () => {
    await dispatch(addItemToCart({ productId: product._id, quantity }));
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ToastBanner visible={toastVisible} message={`Added ${quantity}x ${product.name} to cart`} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Product Details</Text>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => dispatch(toggleWishlistItem(product._id))}
        >
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={22}
            color={isWishlisted ? COLORS.danger : COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.image }} style={styles.heroImage} />

        <Animated.View
          style={[
            styles.contentCard,
            { opacity: fade, transform: [{ translateY: slideUp }] }
          ]}
        >
          <View style={styles.metaRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.category}</Text>
            </View>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color={COLORS.star} />
              <Text style={styles.ratingText}>
                {product.rating.toFixed(1)} ({product.numReviews} reviews)
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>

          <View style={styles.stockRow}>
            <Ionicons
              name={product.stock > 0 ? 'checkmark-circle' : 'close-circle'}
              size={18}
              color={product.stock > 0 ? COLORS.success : COLORS.danger}
            />
            <Text
              style={[
                styles.stockText,
                { color: product.stock > 0 ? COLORS.success : COLORS.danger }
              ]}
            >
              {product.stock > 0 ? `In Stock (${product.stock} units available)` : 'Out of Stock'}
            </Text>
          </View>

          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Quantity Picker */}
          <View style={styles.qtySection}>
            <Text style={styles.sectionLabel}>Quantity</Text>
            <View style={styles.qtyControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Ionicons name="remove" size={18} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              >
                <Ionicons name="add" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalValue}>${(product.price * quantity).toFixed(2)}</Text>
        </View>
        <AnimatedPressable
          onPress={handleAdd}
          disabled={product.stock === 0}
          style={styles.addToCartBtn}
        >
          <Ionicons name="bag-add-outline" size={20} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </AnimatedPressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border
  },
  heroImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    backgroundColor: '#E2E8F0'
  },
  contentCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    marginTop: -20,
    padding: SPACING.lg,
    minHeight: 340
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  badge: {
    backgroundColor: COLORS.accentSoft,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full
  },
  badgeText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '700'
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.accent,
    marginBottom: 10
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.lg
  },
  stockText: {
    fontSize: 13,
    fontWeight: '600'
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg
  },
  qtySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: 4,
    gap: 14
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center'
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.floating
  },
  totalLabel: {
    fontSize: 12,
    color: COLORS.textSecondary
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    height: 50,
    borderRadius: RADIUS.md,
    gap: 8
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  }
});
