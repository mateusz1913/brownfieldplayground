import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const ITEM_HEIGHT = 200;

type ItemT = {
    id: string;
    imageUrl: string;
    title: string;
};

const DATA = Array
    .from({ length: 60 }, (_, i) => i + 200)
    .map<ItemT>((id) => ({
        id: `${id}`,
        imageUrl: `https://picsum.photos/id/${id}/${ITEM_HEIGHT}/300`,
        title: `Image ${id}`,
    }));

const ITEM_RIPPLE = { color: '#BCBCBCBC', foreground: true };

// Reanimated Shared Transitions are only supported on old arch atm

const Item = ({ id, imageUrl, title }: ItemT) => {
    const navigation = useNavigation();
    const handlePress = useCallback(() => {
        navigation.navigate('Detail', { id, imageUrl, title });
    }, [navigation.navigate]);

    return (
        <Pressable
            android_ripple={ITEM_RIPPLE}
            onPress={handlePress}
            style={styles.item}
            testID={`image-${id}`}>
            <Animated.Image
                sharedTransitionTag={`image-${id}`}
                src={imageUrl}
                style={styles.itemImage}
            />
        </Pressable>
    );
};

function getItemLayout(data: ArrayLike<ItemT>, index) {
    return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
}

function keyExtractor(item: ItemT) {
    return item.id;
}

function renderItem({ item }: ListRenderItemInfo<ItemT>) {
    return <Item id={item.id} imageUrl={item.imageUrl} title={item.title} />
}

const Initial = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                data={DATA}
                getItemLayout={getItemLayout}
                initialNumToRender={7}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                style={styles.list}
                windowSize={3}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    item: {
        alignItems: 'center',
        alignSelf: 'stretch',
        height: ITEM_HEIGHT,
    },
    itemImage: {
        height: ITEM_HEIGHT,
        width: 300,
    },
    list: {
        alignSelf: 'stretch',
        flex: 1,
    },
    safeArea: {
        alignSelf: 'stretch',
        flex: 1,
    },
});

export default Initial;
