import type {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureChangeEventPayload,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { withTiming as reanimatedWithTiming } from 'react-native-reanimated';

import type { NavigationState } from '../types/types';

const onChange = (
  event: GestureUpdateEvent<
    PanGestureHandlerEventPayload & PanGestureChangeEventPayload
  >,
  animationValue: number,
  width: number,
  navigationState: NavigationState
) => {
  'worklet';
  if (animationValue > 0) {
    return 0;
  }
  const routesLength = navigationState.routes.length - 1;
  if (animationValue < -width * routesLength) {
    return -width * routesLength;
  }
  return animationValue + event.changeX;
};

const getIndex = (
  navigationState: NavigationState,
  type: 'increment' | 'decrement'
) => {
  'worklet';
  if (type === 'increment') {
    return navigationState.index === navigationState.routes.length - 1
      ? navigationState.index
      : navigationState.index + 1;
  }
  return navigationState.index === 0
    ? navigationState.index
    : navigationState.index - 1;
};

const onEnd = (
  event: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  minimumValueToChangeView: number,
  width: number,
  navigationState: NavigationState
) => {
  'worklet';
  if (event.velocityX < -200) {
    return {
      value: -width * (navigationState.index + 1),
      index: getIndex(navigationState, 'increment'),
    };
  }
  if (event.velocityX > 200) {
    return {
      value: -width * (navigationState.index - 1),
      index: getIndex(navigationState, 'decrement'),
    };
  }
  if (event.translationX < 0) {
    if (event.translationX < -minimumValueToChangeView) {
      return {
        value: -width * (navigationState.index + 1),
        index: getIndex(navigationState, 'increment'),
      };
    }
  }
  if (event.translationX > 0) {
    if (event.translationX > minimumValueToChangeView) {
      return {
        value: -width * (navigationState.index - 1),
        index: getIndex(navigationState, 'decrement'),
      };
    }
  }
  return {
    value: -width * navigationState.index,
    index: navigationState.index,
  };
};

const animation = (newValue: number, duration = 200) => {
  'worklet';
  return reanimatedWithTiming(newValue, { duration });
};

export const AnimationHelper = {
  onChange,
  onEnd,
  animation,
};
