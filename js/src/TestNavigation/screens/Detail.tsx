import type { StaticScreenProps } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

type DetailProps = StaticScreenProps<{ id: string; imageUrl: string; title: string }>;

// Reanimated Shared Transitions are only supported on old arch atm

const Detail = ({ route }: DetailProps) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.main}>
                <Animated.Image
                    sharedTransitionTag={`image-${route.params.id}`}
                    src={route.params.imageUrl}
                    style={styles.image}
                />
                <Text style={styles.title}>{route.params.title}</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    image: {
        alignSelf: 'stretch',
        aspectRatio: 1,
    },
    main: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
        justifyContent: 'center',
    },
    safeArea: {
        alignSelf: 'stretch',
        flex: 1,
    },
    title: {
        color: 'purple',
        fontSize: 36,
        padding: 20,
    },
});

export default Detail;
