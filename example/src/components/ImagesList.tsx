import React, { useCallback } from 'react';
import { FlatList, Image, useWindowDimensions, View } from 'react-native';

interface ImagesListProps {
  data: { id: number; imageUrl: string }[];
  numColumns?: number;
}

export const ImagesList = React.memo<ImagesListProps>(
  ({ data, numColumns = 3 }) => {
    const { width } = useWindowDimensions();

    const renderItem = useCallback(
      ({ item }) => {
        return (
          <View>
            <Image
              style={{ width: width / 3, height: width / 3 }}
              resizeMode="contain"
              source={{ uri: item.imageUrl }}
            />
          </View>
        );
      },
      [width]
    );
    return (
      <FlatList data={data} numColumns={numColumns} renderItem={renderItem} />
    );
  }
);
