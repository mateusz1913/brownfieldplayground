import type { StaticScreenProps } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

type DetailProps = StaticScreenProps<{ id: string; imageUrl: string; title: string }>;

const ITEM_RIPPLE = { color: '#BCBCBCBC', foreground: true };

// Reanimated Shared Transitions are only supported on old arch atm

const Detail = ({ route }: DetailProps) => {
    const navigation = useNavigation();
    const handlePress = useCallback(() => {
        navigation.navigate('DetailImageModal', {
            id: route.params.id,
            imageUrl: route.params.imageUrl,
        });
    }, [navigation.navigate, route.params.id, route.params.imageUrl]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.main}>
                <Pressable
                    android_ripple={ITEM_RIPPLE}
                    onPress={handlePress}
                    style={styles.imageContainer}
                    testID={`image-detail-${route.params.id}`}>
                    <Animated.Image
                        sharedTransitionTag={`image-${route.params.id}`}
                        src={route.params.imageUrl}
                        style={styles.image}
                    />
                </Pressable>
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
    imageContainer: {
        alignSelf: 'stretch',
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
