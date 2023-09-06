import type { SceneMapRoutes, SceneProps } from '../types/types';

export const SceneMap = (routes: SceneMapRoutes) => {
  return ({ route }: SceneProps) => {
    return routes[route.key as keyof SceneMapRoutes];
  };
};
