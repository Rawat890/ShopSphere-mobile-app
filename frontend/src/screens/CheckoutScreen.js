import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrder } from '../store/slices/orderSlice';
import AnimatedPressable from '../components/AnimatedPressable';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../theme/theme';

export default function CheckoutScreen({ route, navigation }) {
  const { total } = route.params;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.orders);

  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [zipCode, setZipCode] = useState(user?.address?.zipCode || '');
  const [country, setCountry] = useState(user?.address?.country || 'United States');
  const [paymentMethod, setPaymentMethod] = useState('GATEWAY_PENDING');

  const handlePlaceOrder = async () => {
    if (!street.trim() || !city.trim() || !state.trim() || !zipCode.trim() || !country.trim()) {
      Alert.alert('Missing Address', 'Please fill in all shipping address fields.');
      return;
    }

    const result = await dispatch(
      placeOrder({
        shippingAddress: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          zipCode: zipCode.trim(),
          country: country.trim()
        },
        paymentMethod
      })
    );

    if (placeOrder.fulfilled.match(result)) {
      Alert.alert(
        'Order Placed!',
        'Your order has been created and is ready in your Order History.',
        [
          {
            text: 'View Orders',
            onPress: () => navigation.navigate('MainTabs', { screen: 'OrdersTab' })
          }
        ]
      );
    } else {
      Alert.alert('Checkout Error', result.payload || 'Could not place order');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>

          <Text style={styles.label}>Street Address</Text>
          <TextInput
            style={styles.input}
            placeholder="123 Main St, Apt 4B"
            value={street}
            onChangeText={setStreet}
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="San Francisco"
                value={city}
                onChangeText={setCity}
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                placeholder="CA"
                value={state}
                onChangeText={setState}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>ZIP / Postal Code</Text>
              <TextInput
                style={styles.input}
                placeholder="94107"
                value={zipCode}
                onChangeText={setZipCode}
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>Country</Text>
              <TextInput
                style={styles.input}
                placeholder="United States"
                value={country}
                onChangeText={setCountry}
              />
            </View>
          </View>
        </View>

        {/* Payment Method Selection (Pre-Gateway Phase) */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Option</Text>
          <Text style={styles.helperText}>
            Online Payment Gateway integration is scheduled for the final phase. Select an option below to place your order now:
          </Text>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'GATEWAY_PENDING' && styles.paymentOptionActive
            ]}
            onPress={() => setPaymentMethod('GATEWAY_PENDING')}
          >
            <Ionicons
              name={
                paymentMethod === 'GATEWAY_PENDING'
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              size={20}
              color={COLORS.accent}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentTitle}>Online Payment (Gateway Pending)</Text>
              <Text style={styles.paymentSub}>Creates order with pending gateway hook</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'COD' && styles.paymentOptionActive
            ]}
            onPress={() => setPaymentMethod('COD')}
          >
            <Ionicons
              name={paymentMethod === 'COD' ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={COLORS.accent}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentTitle}>Cash on Delivery (COD)</Text>
              <Text style={styles.paymentSub}>Pay upon delivery at your doorstep</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Amount Due</Text>
          <Text style={styles.footerAmount}>${total.toFixed(2)}</Text>
        </View>
        <AnimatedPressable
          onPress={handlePlaceOrder}
          disabled={loading}
          style={styles.placeOrderBtn}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.placeOrderText}>Confirm Order</Text>
          )}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  scrollContent: {
    padding: SPACING.md
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.card
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 18
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 5
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 12
  },
  row: {
    flexDirection: 'row',
    gap: 10
  },
  half: {
    flex: 1
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
    marginBottom: 10
  },
  paymentOptionActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentSoft
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  paymentSub: {
    fontSize: 12,
    color: COLORS.textSecondary
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border
  },
  footerLabel: {
    fontSize: 12,
    color: COLORS.textSecondary
  },
  footerAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.accent
  },
  placeOrderBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 26,
    height: 50,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  }
});
