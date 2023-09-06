import React, { useEffect, useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type {
  NavigationState,
  RenderTabsParams,
  SceneProps,
} from '../types/types';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { AnimationHelper } from '../utils/AnimationHelper';

export interface ReanimatedTabViewProps {
  renderTabBar?: (params: RenderTabsParams) => void;
  renderScene: (params: SceneProps) => React.ReactNode;
  initialIndex?: number;
  style?: StyleProp<ViewStyle>;
  navigationState: NavigationState;
  onIndexChange: (index: number) => void;
  percentageTrigger?: number;
}

export const ReanimatedTabView = React.memo<ReanimatedTabViewProps>(
  ({
    initialIndex = 0,
    style = defaultStyles.flex,
    renderScene,
    navigationState,
    onIndexChange,
    renderTabBar,
    percentageTrigger = 0.4,
  }) => {
    const { width } = useWindowDimensions();
    // const width = 160;
    const scrollPosition = useSharedValue(initialIndex);

    useEffect(() => {
      scrollPosition.value = AnimationHelper.animation(
        -navigationState.index * width
      );
    }, [navigationState.index, scrollPosition, width]);

    const minimumValueToChangeView = useMemo(
      () => width * percentageTrigger,
      [percentageTrigger, width]
    );

    const panGesture = React.useMemo(
      () =>
        Gesture.Pan()
          .failOffsetY(-10)
          .failOffsetY(10)
          .activeOffsetX([-20, 20])
          .onChange((event) => {
            scrollPosition.value = AnimationHelper.onChange(
              event,
              scrollPosition.value,
              width,
              navigationState
            );
          })
          .onEnd((event) => {
            const state = AnimationHelper.onEnd(
              event,
              minimumValueToChangeView,
              width,
              navigationState
            );
            scrollPosition.value = AnimationHelper.animation(state.value);
            runOnJS(onIndexChange)(state.index);
          }),
      [
        minimumValueToChangeView,
        navigationState,
        onIndexChange,
        scrollPosition,
        width,
      ]
    );

    const scrollPositionStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: interpolate(
              scrollPosition.value,
              [-width * (navigationState.routes.length - 1), 0],
              [-width * (navigationState.routes.length - 1), 0],
              Extrapolation.CLAMP
            ),
          },
        ],
      };
    });

    const jumpTo = React.useCallback(
      (key: string) => {
        const newIndex = navigationState.routes.findIndex((r) => r.key === key);
        if (newIndex === -1) {
          // throw
          return;
        }
        scrollPosition.value = AnimationHelper.animation(-newIndex * width);
        onIndexChange(newIndex);
      },
      [navigationState.routes, onIndexChange, scrollPosition, width]
    );

    return (
      <GestureHandlerRootView style={defaultStyles.flex}>
        <View style={style}>
          {renderTabBar ? renderTabBar({ navigationState }) : null}
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                scrollPositionStyle,
                defaultStyles.flex,
                { width: width * navigationState.routes.length - 1 },
                defaultStyles.viewsContainer,
              ]}
            >
              {navigationState.routes.map((route) => (
                <View key={route.key} style={{ width }}>
                  {renderScene({ route: route, jumpTo: jumpTo })}
                </View>
              ))}
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    );
  }
);

const defaultStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  viewsContainer: {
    flexDirection: 'row',
  },
});
