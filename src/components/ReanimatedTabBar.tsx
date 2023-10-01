import React, { useCallback, useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import type { ReanimatedTabBarProps } from '../types/types';

export const ReanimatedTabBar = React.memo<ReanimatedTabBarProps>(({
  containerStyle,
  iconStyle,
  titleStyle,
  state,
  onPress,
  withTitle = false,
  defaultInterpolation = true,
  withIcon = true,
}) => {
  const { width } = useWindowDimensions();
  const animation = useAnimatedStyle(() => {
    if (!defaultInterpolation) {
      return { transform: [{ translateX: state.position.value }] };
    }
    return {
      transform: [
        {
          translateX: interpolate(state.position.value,
            [0, width * (state.navigationState.routes.length - 1)],
            [0, (width * (state.navigationState.routes.length - 1)) / state.navigationState.routes.length],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const onReceiveIndex = useCallback(
    (index: number) => {
      return () => onPress(index);
    },
    [onPress]
  );

  const icon = useMemo(() => {
    const route = state.navigationState.routes[state.navigationState.index];
    if (!route?.icon) {
      return;
    }
    return route.icon;
  }, []);

  return (
    <View style={styles.container}>
      {state.navigationState.routes.map((route, index) => (
        <Pressable style={styles.pressable} key={index.toString() + 'ciao'} onPress={onReceiveIndex(index)}>
          {() => (
            <View
              style={containerStyle || styles.singleButton}
            >
              {withIcon && icon !== undefined ?
                <Image style={iconStyle} source={state.navigationState.routes[state.navigationState.index]!.icon!} /> :
                null
              }
              {withTitle ? <Text style={titleStyle}>{route.title}</Text> : null}
            </View>
          )}
        </Pressable>
      ))}
      <Animated.View style={[animation, styles.animationView, { width: width / state.navigationState.routes.length }]} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  singleButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressable: {
    flex: 1,
  },
  animationView: {
    position: 'absolute',
    height: 3,
    bottom: 0,
    elevation: 1,
    backgroundColor: 'cyan',
  },
});
