import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateUserProfile,
  logoutUser,
  deleteUserAccount
} from '../store/slices/authSlice';
import { resetCartState } from '../store/slices/cartSlice';
import AnimatedPressable from '../components/AnimatedPressable';
import ToastBanner from '../components/ToastBanner';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../theme/theme';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [zipCode, setZipCode] = useState(user?.address?.zipCode || '');
  const [country, setCountry] = useState(user?.address?.country || '');
  const [toastVisible, setToastVisible] = useState(false);

  const handleSaveProfile = async () => {
    const result = await dispatch(
      updateUserProfile({
        name: name.trim(),
        phone: phone.trim(),
        address: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          zipCode: zipCode.trim(),
          country: country.trim()
        }
      })
    );

    if (updateUserProfile.fulfilled.match(result)) {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2200);
    } else {
      Alert.alert('Update Failed', result.payload || 'Could not update profile');
    }
  };

  const handleLogout = () => {
    dispatch(resetCartState());
    dispatch(logoutUser());
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account Permanently?',
      'This action cannot be undone. Your profile, saved cart, wishlist, and order history will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete My Account',
          style: 'destructive',
          onPress: async () => {
            dispatch(resetCartState());
            await dispatch(deleteUserAccount());
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ToastBanner visible={toastVisible} message="Profile saved successfully!" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>My Profile</Text>

        {/* User Summary Card */}
        <View style={styles.avatarCard}>
          <Image source={{ uri: user?.avatar }} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* Quick Navigation */}
        <AnimatedPressable
          style={styles.menuRow}
          onPress={() => navigation.navigate('Wishlist')}
        >
          <View style={styles.menuLeft}>
            <Ionicons name="heart" size={20} color={COLORS.danger} />
            <Text style={styles.menuText}>Saved Wishlist</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
        </AnimatedPressable>

        {/* Edit Profile Form */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Details</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Default Shipping Address</Text>

          <Text style={styles.label}>Street</Text>
          <TextInput style={styles.input} value={street} onChangeText={setStreet} />

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>City</Text>
              <TextInput style={styles.input} value={city} onChangeText={setCity} />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>State</Text>
              <TextInput style={styles.input} value={state} onChangeText={setState} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>ZIP Code</Text>
              <TextInput style={styles.input} value={zipCode} onChangeText={setZipCode} />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>Country</Text>
              <TextInput style={styles.input} value={country} onChangeText={setCountry} />
            </View>
          </View>

          <AnimatedPressable
            style={styles.saveBtn}
            onPress={handleSaveProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveBtnText}>Save Profile Changes</Text>
            )}
          </AnimatedPressable>
        </View>

        {/* Session & Danger Zone */}
        <AnimatedPressable style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.primary} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </AnimatedPressable>

        <AnimatedPressable style={styles.deleteBtn} onPress={handleDeleteAccount}>
          <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
          <Text style={styles.deleteText}>Delete Account Permanently</Text>
        </AnimatedPressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.md, paddingBottom: 36 },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md
  },
  avatarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: 14,
    marginBottom: SPACING.md,
    ...SHADOWS.card
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0'
  },
  userName: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  userEmail: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  menuText: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.card
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 4
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 12
  },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  saveBtn: {
    backgroundColor: COLORS.accent,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    height: 50,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
    marginBottom: 12
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dangerSoft,
    height: 50,
    borderRadius: RADIUS.md,
    gap: 8
  },
  deleteText: { fontSize: 15, fontWeight: '700', color: COLORS.danger }
});
