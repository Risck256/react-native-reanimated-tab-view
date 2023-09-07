import React from 'react';
import type { SharedValue } from 'react-native-reanimated';

export interface Route {
  key: string;
  title: string;
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
