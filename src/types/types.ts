import React from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type { ImageProps, ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface ReanimatedTabViewProps {
  renderTabBar?: (params: RenderTabsParams) => void;
  renderScene: (params: SceneProps) => React.ReactNode;
  navigationState: NavigationState;
  onIndexChange: (index: number) => void;
  percentageTrigger?: number;
  positionInterpolation?: PositionInterpolation;
  lazy?: boolean;
  LazyPlaceholder?: () => React.ReactNode;
  swipeEnabled?: boolean;
  absoluteTabBar?: boolean;
  customTabBarPosition?: { top?: number, bottom?: number, left?: number, right?: number };
}

export interface ReanimatedTabBarProps {
  state: RenderTabsParams;
  onPress: (index: number) => void;
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  titleStyle?: StyleProp<TextStyle>;
  withIcon?: boolean;
  withTitle?: boolean;
  defaultInterpolation?: boolean;
}

export interface Route {
  key: string;
  title: string;
  icon?: ImageProps;
}

export type NavigationState = { index: number; routes: Route[] };

export interface RenderTabsParams {
  navigationState: NavigationState;
  position: SharedValue<number>;
}

export interface SceneProps {
  route: Route;
  jumpTo?: (key: string) => void;
}

export interface SceneMapRoutes {
  [key: string]: React.ReactNode;
}

export type PositionInterpolation = { input: number[]; output: number[] };
