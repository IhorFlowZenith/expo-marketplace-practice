import Colors from '@/constants/Colors';
import React, { memo } from 'react';
import { Dimensions, View as RNView, StyleSheet, TextInput } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { SharedValue, useAnimatedProps, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_CONTAINER_WIDTH = SCREEN_WIDTH - 48;
const SLIDER_WIDTH = SLIDER_CONTAINER_WIDTH - 26;
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface PriceRangeSliderProps {
  colors: { text: string; border: string; sheet: string };
  minPrice: SharedValue<number>;
  maxPrice: SharedValue<number>;
  minX: SharedValue<number>;
  maxX: SharedValue<number>;
}

const PriceRangeSlider = ({ colors, minPrice, maxPrice, minX, maxX }: PriceRangeSliderProps) => {
  const ctxMin = useSharedValue(0);
  const ctxMax = useSharedValue(0);

  const gestureMin = Gesture.Pan()
    .onStart(() => { ctxMin.value = minX.value; })
    .onUpdate((event) => {
      let val = ctxMin.value + event.translationX;
      if (val < 0) val = 0;
      if (val > maxX.value - 40) val = maxX.value - 40;
      minX.value = val;
      minPrice.value = Math.round((val / SLIDER_WIDTH) * 1000);
    });

  const gestureMax = Gesture.Pan()
    .onStart(() => { ctxMax.value = maxX.value; })
    .onUpdate((event) => {
      let val = ctxMax.value + event.translationX;
      if (val > SLIDER_WIDTH) val = SLIDER_WIDTH;
      if (val < minX.value + 40) val = minX.value + 40;
      maxX.value = val;
      maxPrice.value = Math.round((val / SLIDER_WIDTH) * 1000);
    });

  const trackStyle = useAnimatedStyle(() => ({
    left: minX.value + 13,
    width: Math.max(0, maxX.value - minX.value),
  }));

  const thumbMinStyle = useAnimatedStyle(() => ({ transform: [{ translateX: minX.value }] }));
  const thumbMaxStyle = useAnimatedStyle(() => ({ transform: [{ translateX: maxX.value }] }));

  const minPriceProps = useAnimatedProps(() => ({ text: `$${minPrice.value}` } as any));
  const maxPriceProps = useAnimatedProps(() => ({ text: `$${maxPrice.value}` } as any));

  return (
    <RNView>
      <RNView style={styles.priceHeader}>
        <AnimatedTextInput editable={false} defaultValue={`$${minPrice.value}`} animatedProps={minPriceProps} underlineColorAndroid="transparent" style={[styles.animatedPrice, { color: colors.text }]} />
        <AnimatedTextInput editable={false} defaultValue={`$${maxPrice.value}`} animatedProps={maxPriceProps} underlineColorAndroid="transparent" style={[styles.animatedPrice, { color: colors.text, textAlign: 'right' }]} />
      </RNView>
      <RNView style={styles.sliderContainer}>
        <RNView style={[styles.sliderTrack, { backgroundColor: colors.border }]} />
        <Animated.View style={[styles.sliderActiveTrack, { backgroundColor: Colors.palette.primary }, trackStyle]} />
        <GestureDetector gesture={gestureMin}>
          <Animated.View style={[styles.thumbHandle, thumbMinStyle]}>
            <RNView style={[styles.sliderThumb, { backgroundColor: Colors.palette.primary, borderColor: colors.sheet }]} />
          </Animated.View>
        </GestureDetector>
        <GestureDetector gesture={gestureMax}>
          <Animated.View style={[styles.thumbHandle, thumbMaxStyle]}>
            <RNView style={[styles.sliderThumb, { backgroundColor: Colors.palette.primary, borderColor: colors.sheet }]} />
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
    marginBottom: 20
  },
  animatedPrice: {
    fontSize: 16,
    fontWeight: '700',
    width: 100,
    padding: 0,
    margin: 0
  },
  sliderContainer: {
    height: 40,
    width: SLIDER_CONTAINER_WIDTH,
    justifyContent: 'center'
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
    width: SLIDER_WIDTH,
    position: 'absolute',
    left: 13
  },
  sliderActiveTrack: {
    position: 'absolute',
    height: 6,
    borderRadius: 3
  },
  thumbHandle: {
    position: 'absolute',
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  sliderThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
});

export default memo(PriceRangeSlider);
