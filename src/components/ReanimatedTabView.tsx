import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import type {
  NavigationState,
  PositionInterpolation,
  RenderTabsParams,
  SceneProps,
} from '../types/types';
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
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { AnimationHelper } from '../utils/AnimationHelper';

export interface ReanimatedTabViewProps {
  renderTabBar?: (params: RenderTabsParams) => void;
  renderScene: (params: SceneProps) => React.ReactNode;
  navigationState: NavigationState;
  onIndexChange: (index: number) => void;
  percentageTrigger?: number;
  positionInterpolation?: PositionInterpolation;
  lazy?: boolean;
  LazyPlaceholder?: () => React.ReactNode;
}

export const ReanimatedTabView = React.memo<ReanimatedTabViewProps>(
  ({
    renderScene,
    navigationState,
    onIndexChange,
    renderTabBar,
    percentageTrigger = 0.4,
    positionInterpolation,
    lazy = false,
    LazyPlaceholder = () => null,
  }) => {
    const { width } = useWindowDimensions();
    const loadedScreens = useRef([
      navigationState.routes[navigationState.index],
    ]);
    // const width = 160;
    const scrollPosition = useSharedValue(navigationState.index);

    const position = useDerivedValue(() => {
      if (!positionInterpolation) {
        return -scrollPosition.value;
      }
      return interpolate(
        -scrollPosition.value,
        positionInterpolation.input,
        positionInterpolation.output,
        Extrapolation.CLAMP
      );
    }, [positionInterpolation]);

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

    const chooseRender = useCallback(
      (params: SceneProps, useRenderScene = true) => (
        <View key={`RNNTabView_${params.route.key}`} style={{ width }}>
          {useRenderScene ? renderScene(params) : LazyPlaceholder()}
        </View>
      ),
      [LazyPlaceholder, renderScene, width]
    );

    const Routes = useMemo(() => {
      return navigationState.routes.map((route, index) => {
        if (!lazy) {
          return chooseRender({ route, jumpTo });
        }
        const screen = loadedScreens.current.find(
          (loadedScreen) => loadedScreen?.key === route.key
        );
        if (screen !== undefined) {
          return chooseRender({ route, jumpTo });
        }
        if (navigationState.index === index) {
          loadedScreens.current.push(route);
          return chooseRender({ route, jumpTo });
        }
        return chooseRender({ route, jumpTo }, false);
      });
    }, [
      navigationState.routes,
      navigationState.index,
      lazy,
      chooseRender,
      jumpTo,
    ]);

    return (
      <GestureHandlerRootView style={defaultStyles.flex}>
        <View style={defaultStyles.flex}>
          {renderTabBar ? renderTabBar({ navigationState, position }) : null}
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                scrollPositionStyle,
                defaultStyles.flex,
                { width: width * navigationState.routes.length - 1 },
                defaultStyles.viewsContainer,
              ]}
            >
              {Routes}
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
