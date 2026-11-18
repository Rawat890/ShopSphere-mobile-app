import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../store/slices/authSlice';
import AnimatedPressable from '../components/AnimatedPressable';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../theme/theme';

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('demo@shopsphere.com');
  const [password, setPassword] = useState('Password123!');
  const [secureText, setSecureText] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 9, useNativeDriver: true })
    ]).start();
  }, []);

  const handleLogin = () => {
    if (!email.trim() || !password) return;
    dispatch(loginUser({ email: email.trim(), password }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Animated.View
          style={[
            styles.card,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.logoBadge}>
            <Ionicons name="bag-handle" size={30} color="#FFFFFF" />
          </View>

          <Text style={styles.title}>Welcome to ShopSphere</Text>
          <Text style={styles.subtitle}>
            Sign in to explore curated products and manage your orders.
          </Text>

          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                if (error) dispatch(clearAuthError());
                setEmail(text);
              }}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={secureText}
              value={password}
              onChangeText={(text) => {
                if (error) dispatch(clearAuthError());
                setPassword(text);
              }}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Ionicons
                name={secureText ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <AnimatedPressable onPress={handleLogin} disabled={loading} style={styles.primaryBtn}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryBtnText}>Sign In</Text>
            )}
          </AnimatedPressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New to ShopSphere? </Text>
            <TouchableOpacity
              onPress={() => {
                dispatch(clearAuthError());
                navigation.navigate('Register');
              }}
            >
              <Text style={styles.linkText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
  logoBadge: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md
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
    lineHeight: 20,
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
    height: 50,
    marginBottom: SPACING.md,
    gap: 10
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
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
    color: COLORS.accent
  }
});
