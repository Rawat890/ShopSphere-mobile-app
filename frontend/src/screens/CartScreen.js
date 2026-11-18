import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearUserCart
} from '../store/slices/cartSlice';
import AnimatedPressable from '../components/AnimatedPressable';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../theme/theme';

export default function CartScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart ({items.length})</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={() => dispatch(clearUserCart())}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="cart-outline" size={46} color={COLORS.accent} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Browse our catalog and add items to start building your order.
          </Text>
          <AnimatedPressable
            style={styles.shopNowBtn}
            onPress={() => navigation.navigate('HomeTab')}
          >
            <Text style={styles.shopNowText}>Explore Products</Text>
          </AnimatedPressable>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product._id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.cartCard}>
                <Image source={{ uri: item.product.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.product.name}
                  </Text>
                  <Text style={styles.itemPrice}>${item.product.price.toFixed(2)}</Text>

                  <View style={styles.controlsRow}>
                    <View style={styles.qtyBox}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() =>
                          dispatch(
                            updateCartItemQuantity({
                              productId: item.product._id,
                              quantity: item.quantity - 1
                            })
                          )
                        }
                      >
                        <Ionicons name="remove" size={16} color={COLORS.primary} />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() =>
                          dispatch(
                            updateCartItemQuantity({
                              productId: item.product._id,
                              quantity: item.quantity + 1
                            })
                          )
                        }
                      >
                        <Ionicons name="add" size={16} color={COLORS.primary} />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => dispatch(removeItemFromCart(item.product._id))}
                    >
                      <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />

          {/* Price Summary Footer */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping (Free over $100)</Text>
              <Text style={styles.summaryValue}>
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated Tax (8%)</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>

            <AnimatedPressable
              style={styles.checkoutBtn}
              onPress={() =>
                navigation.navigate('Checkout', {
                  subtotal,
                  shipping,
                  tax,
                  total
                })
              }
            >
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </AnimatedPressable>
          </View>
        </>
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
    paddingVertical: SPACING.md
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  clearText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.danger
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 16
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 12,
    marginBottom: 12,
    ...SHADOWS.card
  },
  itemImage: {
    width: 84,
    height: 84,
    borderRadius: RADIUS.md,
    backgroundColor: '#F1F5F9'
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between'
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.accent
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 12
  },
  qtyBtn: {
    padding: 4
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    ...SHADOWS.floating
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 16
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.accent
  },
  checkoutBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32
  },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24
  },
  shopNowBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: RADIUS.md
  },
  shopNowText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15
  }
});
