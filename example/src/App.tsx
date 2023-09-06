import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import { SceneMap } from '../../src/utils/SceneMap';
import { ReanimatedTabView } from '../../src/components/ReanimatedTabView';
import type { RenderTabsParams } from '../../src/types/types';

export default function App() {
  const [index, setIndex] = useState(0);
  const renderScene = SceneMap({
    first: <View style={{ flex: 1, backgroundColor: 'blue' }} />,
    second: <View style={{ flex: 1, backgroundColor: 'red' }} />,
    third: (
        <ScrollView nestedScrollEnabled style={{ elevation: 1000 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((a) => (
            <View key={a} style={{ height: 120, borderWidth: 1 }} />
          ))}
        </ScrollView>
    ),
  });

  const routes = useMemo(
    () => [
      { key: 'first', title: 'Ciao' },
      { key: 'second', title: 'Culo' },
      { key: 'third', title: 'fdsaf' },
    ],
    []
  );

  const renderTabBar = useCallback(({ navigationState }: RenderTabsParams) => {
    return (
      <View
        style={{ flexDirection: 'row', backgroundColor: 'white', height: 50 }}
      >
        {navigationState.routes.map((route, index) => (
          <Pressable style={{ flex: 1 }} onPress={() => setIndex(index)}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  index === navigationState.index ? 'blue' : 'transparent',
              }}
            >
              <Text>{route.title}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <ReanimatedTabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
