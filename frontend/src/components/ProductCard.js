import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from './AnimatedPressable';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../theme/theme';

const CARD_WIDTH = (Dimensions.get('window').width - SPACING.md * 3) / 2;

export default function ProductCard({
  product,
  index = 0,
  isWishlisted = false,
  onPress,
  onAddToCart,
  onToggleWishlist
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 380,
        delay: Math.min(index * 65, 450),
        useNativeDriver: true
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: Math.min(index * 65, 450),
        useNativeDriver: true,
        tension: 65,
        friction: 10
      })
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <AnimatedPressable onPress={onPress} style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
          <TouchableOpacity
            style={styles.wishlistBtn}
            onPress={onToggleWishlist}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={18}
              color={isWishlisted ? COLORS.danger : COLORS.primary}
            />
          </TouchableOpacity>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color={COLORS.star} />
            <Text style={styles.ratingText}>
              {product.rating.toFixed(1)} ({product.numReviews})
            </Text>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={onAddToCart}
              disabled={product.stock === 0}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: CARD_WIDTH,
    marginBottom: SPACING.md
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.card
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
    backgroundColor: '#F1F5F9'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  wishlistBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600'
  },
  details: {
    padding: 12
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    minHeight: 36,
    marginBottom: 4
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500'
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.accent
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
