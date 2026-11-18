import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../store/slices/orderSlice';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../theme/theme';

export default function OrdersScreen() {
  const dispatch = useDispatch();
  const { items: orders, loading } = useSelector((state) => state.orders);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchOrders());
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>

      {loading && orders.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="receipt-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptySubtitle}>
                Once you place an order, it will appear here with status tracking.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>Order #{item._id.slice(-6).toUpperCase()}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{item.orderStatus}</Text>
                </View>
              </View>

              {item.items.map((prod, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Image source={{ uri: prod.image }} style={styles.thumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {prod.name}
                    </Text>
                    <Text style={styles.itemQty}>
                      Qty: {prod.quantity} × ${prod.price.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}

              <View style={styles.orderFooter}>
                <View style={styles.paymentBadge}>
                  <Text style={styles.paymentBadgeText}>
                    Payment: {item.paymentStatus.toUpperCase()} ({item.paymentMethod})
                  </Text>
                </View>
                <Text style={styles.totalAmount}>${item.totalAmount.toFixed(2)}</Text>
              </View>
            </View>
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 24
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  orderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: 14,
    ...SHADOWS.card
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
    marginBottom: 10
  },
  orderId: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.textSecondary
  },
  statusBadge: {
    backgroundColor: COLORS.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full
  },
  statusText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '700'
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: '#F1F5F9'
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary
  },
  itemQty: {
    fontSize: 12,
    color: COLORS.textSecondary
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    marginTop: 6
  },
  paymentBadge: {
    backgroundColor: COLORS.warningSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm
  },
  paymentBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.warning
  },
  totalAmount: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  emptyBox: {
    alignItems: 'center',
    paddingTop: 80,
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
