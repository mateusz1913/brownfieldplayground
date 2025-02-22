import type { StaticScreenProps } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

type DetailImageModalProps = StaticScreenProps<{ id: string; imageUrl: string }>;

// Reanimated Shared Transitions are only supported on old arch atm

const DetailImageModal = ({ route }: DetailImageModalProps) => {
    const navigation = useNavigation();
    const positionX = useSharedValue(0);
    const positionY = useSharedValue(0);
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);

    const panGesture = useMemo(() => {
        return Gesture.Pan()
            .averageTouches(true)
            .onChange((e) => {
                positionX.value += e.changeX;
                positionY.value += e.changeY;
            });
    }, [positionX, positionY]);

    const rotationGesture = useMemo(() => {
        return Gesture.Rotation()
            .onChange((e) => {
                rotation.value += e.rotationChange;
            });
    }, [rotation]);

    const scaleGesture = useMemo(() => {
        return Gesture.Pinch()
            .onChange((e) => {
                scale.value *= e.scaleChange;
            });
    }, [scale]);

    const allGestures = useMemo(() => {
        return Gesture.Simultaneous(panGesture, rotationGesture, scaleGesture);
    }, [panGesture, rotationGesture, scaleGesture]);

    const tapCloseGesture = useMemo(() => {
        return Gesture.Tap()
            .onEnd((_, success) => {
                if (success) {
                    navigation.pop();
                }
            })
            .runOnJS(true);
    }, [navigation.pop]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: positionX.value },
                { translateY: positionY.value },
                { scale: scale.value },
                { rotateZ: `${rotation.value}rad` },
            ],
        };
    });

    return (
        <GestureHandlerRootView style={styles.main}>
            <GestureDetector gesture={allGestures}>
                <Animated.Image
                    sharedTransitionTag={`image-${route.params.id}`}
                    src={route.params.imageUrl}
                    style={[styles.image, animatedStyle]}
                />
            </GestureDetector>
            <GestureDetector gesture={tapCloseGesture}>
                <View style={styles.closeButton}>
                    <View style={[styles.closeButtonLine, styles.closeButtonLine1]} />
                    <View style={[styles.closeButtonLine, styles.closeButtonLine2]} />
                </View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        left: 30,
        top: 60,
        alignItems: 'center',
        height: 20,
        width: 20,
        justifyContent: 'center',
    },
    closeButtonLine: {
        backgroundColor: 'orange',
        borderRadius: 1,
        height: 4,
        position: 'absolute',
        width: 20,
    },
    closeButtonLine1: {
        transform: [{ rotateZ: '45deg' }],
    },
    closeButtonLine2: {
        transform: [{ rotateZ: '135deg' }],
    },
    image: {
        alignSelf: 'stretch',
        aspectRatio: 1,
        marginVertical: 'auto',
    },
    main: {
        alignSelf: 'stretch',
        backgroundColor: '#777777AA',
        flex: 1,
    },
});

export default DetailImageModal;
