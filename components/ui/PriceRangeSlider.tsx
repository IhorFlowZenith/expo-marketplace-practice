import Colors from '@/constants/Colors';
import React, { memo, useRef } from 'react';
import { View as RNView, StyleSheet, TextInput, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedProps, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const THUMB_RADIUS = 13;
const THUMB_HITBOX = 44;
const THUMB_OFFSET = THUMB_HITBOX / 2 - THUMB_RADIUS;

interface PriceRangeSliderProps {
  colors: { text: string; border: string; sheet: string };
  initialMin?: number;
  initialMax?: number;
  maxValue?: number;
  onValueChange: (min: number, max: number) => void;
}

const PriceRangeSlider = ({ colors, initialMin = 0, initialMax = 1000, maxValue = 1000, onValueChange }: PriceRangeSliderProps) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const TRACK_WIDTH = SCREEN_WIDTH - 48 - 26;
  const MIN_POS = -THUMB_OFFSET;
  const MAX_POS = TRACK_WIDTH - THUMB_OFFSET;
  const RANGE = MAX_POS - MIN_POS;

  const priceToPos = (price: number) => (price / maxValue) * RANGE + MIN_POS;

  const minX = useSharedValue(priceToPos(initialMin));
  const maxX = useSharedValue(priceToPos(initialMax));
  const minPrice = useSharedValue(initialMin);
  const maxPrice = useSharedValue(initialMax);
  const ctxMin = useSharedValue(0);
  const ctxMax = useSharedValue(0);
  const cbRef = useRef(onValueChange);
  cbRef.current = onValueChange;

  const notify = (min: number, max: number) => cbRef.current(min, max);

  const gestureMin = Gesture.Pan()
    .onStart(() => { ctxMin.value = minX.value; })
    .onUpdate((e) => {
      let val = ctxMin.value + e.translationX;
      if (val < MIN_POS) val = MIN_POS;
      if (val > maxX.value - 40) val = maxX.value - 40;
      minX.value = val;
      minPrice.value = Math.round(((val - MIN_POS) / RANGE) * maxValue);
      runOnJS(notify)(minPrice.value, maxPrice.value);
    });

  const gestureMax = Gesture.Pan()
    .onStart(() => { ctxMax.value = maxX.value; })
    .onUpdate((e) => {
      let val = ctxMax.value + e.translationX;
      if (val > MAX_POS) val = MAX_POS;
      if (val < minX.value + 40) val = minX.value + 40;
      maxX.value = val;
      maxPrice.value = Math.round(((val - MIN_POS) / RANGE) * maxValue);
      runOnJS(notify)(minPrice.value, maxPrice.value);
    });

  const trackStyle = useAnimatedStyle(() => ({
    left: minX.value + THUMB_HITBOX / 2,
    width: Math.max(0, maxX.value - minX.value),
  }));
  const thumbMinStyle = useAnimatedStyle(() => ({ transform: [{ translateX: minX.value }] }));
  const thumbMaxStyle = useAnimatedStyle(() => ({ transform: [{ translateX: maxX.value }] }));
  const minProps = useAnimatedProps(() => ({ text: `$${minPrice.value}` } as any));
  const maxProps = useAnimatedProps(() => ({ text: `$${maxPrice.value}` } as any));

  return (
    <RNView>
      <RNView style={styles.priceHeader}>
        <AnimatedTextInput editable={false} defaultValue={`$${initialMin}`} animatedProps={minProps} underlineColorAndroid="transparent" style={[styles.price, { color: colors.text }]} />
        <AnimatedTextInput editable={false} defaultValue={`$${initialMax}`} animatedProps={maxProps} underlineColorAndroid="transparent" style={[styles.price, { color: colors.text, textAlign: 'right' }]} />
      </RNView>
      <RNView style={styles.sliderContainer}>
        <RNView style={[styles.track, { backgroundColor: colors.border, width: TRACK_WIDTH }]} />
        <Animated.View style={[styles.activeTrack, { backgroundColor: Colors.palette.primary }, trackStyle]} />
        <GestureDetector gesture={gestureMin}>
          <Animated.View style={[styles.thumbHit, thumbMinStyle]}>
            <RNView style={[styles.thumb, { backgroundColor: Colors.palette.primary, borderColor: colors.sheet }]} />
          </Animated.View>
        </GestureDetector>
        <GestureDetector gesture={gestureMax}>
          <Animated.View style={[styles.thumbHit, thumbMaxStyle]}>
            <RNView style={[styles.thumb, { backgroundColor: Colors.palette.primary, borderColor: colors.sheet }]} />
          </Animated.View>
        </GestureDetector>
      </RNView>
    </RNView>
  );
};

const styles = StyleSheet.create({
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 13
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    width: 100,
    padding: 0,
    margin: 0
  },
  sliderContainer: {
    height: 40,
    width: '100%',
    justifyContent: 'center'
  },
  track: {
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    left: 13
  },
  activeTrack: {
    position: 'absolute',
    height: 6,
    borderRadius: 3
  },
  thumbHit: {
    position: 'absolute',
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
});

export default memo(PriceRangeSlider);
