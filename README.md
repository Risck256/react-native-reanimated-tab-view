# react-native-reanimated-tab-view

An implementation of Tab View fully managed by react-native-reanimated library.

:warning: **This library is currently under development, production use is not recommended.** :warning:

Feel free to open new issue.

## Installation

```sh
yarn add react-native-reanimated-tab-view
```
To run properly, it needs to install two other dependencies:.

| Library                                                                                  | Supported version |
|:-----------------------------------------------------------------------------------------|------------------:|
| [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/)           |           >=3.3.0 |
| [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/) |         >= 2.12.0 |

## Dependency Installation

```sh
yarn add react-native-reanimated react-native-gesture-handler
```
According to react-native-reanimated documentation, it needs to add this line in babel.config.js

```javascript
module.exports = {
  presets: [/*...*/],
  plugins: [/* other plugins, */ 'react-native-reanimated/plugin'], // <-- add this (the reanimated's plugin MUST BE the last)
};
```

## Usage Example

```javascript
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { ReanimatedTabView, SceneMap } from 'react-native-reanimated-tab-view';

export const TabView = () => {
  const [index, setIndex] = useState(0);
  const renderScene = SceneMap({
    first: <View style={{ flex: 1, backgroundColor: 'blue' }} />,
    second: <View style={{ flex: 1, backgroundColor: 'yellow' }} />,
    third: <View style={{ flex: 1, backgroundColor: 'red' }} />,
  });

  const routes = useMemo(
    () => [
      { key: 'first', title: 'Posts' },
      { key: 'second', title: 'Reels' },
      { key: 'third', title: 'Tagged' },
    ],
    []
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ReanimatedTabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
      />
    </View>
  );
};
```

To see full implementation, see [example](/example) folder

## Properties

| Property              | Description                                                         | Type                                            | Required | Default |
|:----------------------|:--------------------------------------------------------------------|:------------------------------------------------|----------|:--------|
| renderScene           | Used to render each card specified in the code                      | function                                        | true     | -       |
| navigationState       | Object accepts index and routes to manage the visible screen        | [NavigationState](#navigationstate)             | true     | -       |
| onIndexChange         | Callback to pass the current index on the parent component          | function                                        | true     | -       |
| percentageTrigger     | The portion of screen you have to swipe before change tab           | number                                          | false    | 0.4     |
| positionInterpolation | Object to manipulate animation passed to TabBar component           | [PositionInterpolation](#positioninterpolation) | false    | -       |
| lazy                  | Decide to render only visible tabs or all tabs at component's mount | boolean                                         | false    | false   |
| LazyPlaceholder       | Component to render when lazy is true                               | function                                        | false    | null    |
| renderTabBar          | Used to render a TabBar custom component                            | function                                        | false    | -       |

## Types
#### Route `{ key: string; title: string }`

#### NavigationState `{ index: number; routes: Route[] }`

#### PositionInterpolation `{ input: number[]; output: number[] }`

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
