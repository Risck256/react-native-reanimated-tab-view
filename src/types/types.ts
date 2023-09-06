import React from 'react';

export interface Route {
  key: string;
  title: string;
}

export type NavigationState = { index: number; routes: Route[] };

export interface RenderTabsParams {
  navigationState: NavigationState;
}

export interface SceneProps {
  route: Route;
  jumpTo?: (key: string) => void;
}

export interface SceneMapRoutes {
  [key: string]: React.ReactNode;
}
