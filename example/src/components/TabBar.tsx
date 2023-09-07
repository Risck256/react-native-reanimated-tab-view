import React, { useCallback } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { RenderTabsParams } from 'react-native-reanimated-tab-view';

interface TabViewProps {
  state: RenderTabsParams;
  onPress: (index: number) => void;
}
export const TabBar = React.memo<TabViewProps>(({ state, onPress }) => {
  const { width } = useWindowDimensions();
  const animation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: state.position.value,
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

  return (
    <View
      style={{ flexDirection: 'row', backgroundColor: 'white', height: 50 }}
    >
      {state.navigationState.routes.map((route, index) => (
        <Pressable
          key={`tabBar_${route.key}`}
          style={{ flex: 1 }}
          onPress={onReceiveIndex(index)}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text>{route.title}</Text>
          </View>
        </Pressable>
      ))}
      <Animated.View
        style={[
          animation,
          {
            width: width / 3,
            height: 3,
            position: 'absolute',
            bottom: 0,
            elevation: 10,
            backgroundColor: 'green',
          },
        ]}
      />
    </View>
  );
});
