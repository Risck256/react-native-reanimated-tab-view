import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { SceneMap } from '../../src/utils/SceneMap';
import { ReanimatedTabView } from 'react-native-reanimated-tab-view';
import type { RenderTabsParams, Route } from 'react-native-reanimated-tab-view';
import { ImagesList } from './components/ImagesList';
import { posts } from './mocks/posts';
import { ReanimatedTabBar } from '../../src/components/ReanimatedTabBar';

export default function App() {
  const [index, setIndex] = useState(0);
  const renderScene = SceneMap({
    first: <ImagesList data={[...posts].slice(0, 5)} numColumns={3} />,
    second: <ImagesList data={[...posts].slice(0, 10)} numColumns={3} />,
    third: <ImagesList data={posts} numColumns={3} />,
    fourth: <ImagesList data={posts} numColumns={3} />,
  });

  const routes: Route[] = useMemo(
    () => [
      { key: 'first', title: 'Posts', icon: require('../assets/favicon.png') },
      { key: 'second', title: 'Reels', icon: require('../assets/favicon.png') },
      { key: 'third', title: 'Tagged', icon: require('../assets/favicon.png') },
      { key: 'third', title: 'Tagged', icon: require('../assets/favicon.png') },
    ],
    []
  );
  const { width } = useWindowDimensions();

  const renderTabBar = useCallback((state: RenderTabsParams) => {
    return <ReanimatedTabBar withIcon={false} withTitle defaultInterpolation={false} iconStyle={{ width: 25, height: 25 }} state={state} onPress={setIndex} />;
  }, []);

  return (
    <View style={styles.container}>
      <ReanimatedTabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        positionInterpolation={{
          input: [0, width * (routes.length - 1)],
          output: [0, (width * (routes.length - 1)) / routes.length],
        }}
        LazyPlaceholder={() => (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <ActivityIndicator size="large" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
