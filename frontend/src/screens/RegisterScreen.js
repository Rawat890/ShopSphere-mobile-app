import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../store/slices/authSlice';
import AnimatedPressable from '../components/AnimatedPressable';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../theme/theme';

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || password.length < 6) return;
    dispatch(
      registerUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password
      })
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join ShopSphere for seamless mobile shopping.</Text>

          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Rohan Rawat"
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="rohan@example.com"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={styles.label}>Phone Number (Optional)</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="+1 555 019 2834"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <Text style={styles.label}>Password (Min 6 characters)</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Create a strong password"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <AnimatedPressable onPress={handleRegister} disabled={loading} style={styles.primaryBtn}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryBtnText}>Sign Up</Text>
            )}
          </AnimatedPressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => {
                dispatch(clearAuthError());
                navigation.goBack();
              }}
            >
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.card
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerSoft,
    padding: 12,
    borderRadius: RADIUS.md,
    gap: 8,
    marginBottom: SPACING.md
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '600',
    flex: 1
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: SPACING.md,
    gap: 10
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary
  },
  primaryBtn: {
    backgroundColor: COLORS.accent,
    height: 52,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary
  }
});
