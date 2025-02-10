import React, { useEffect } from 'react';
import { Alert, BackHandler, Image, StyleSheet, Text, View } from 'react-native';

const src = "https://picsum.photos/id/204/500/333";

function Test() {
    useEffect(() => {
        function handleBack() {
            Alert.alert(
                'Exit warning',
                'Are you sure you want to exit?',
                [
                    { text: 'Cancel', onPress: () => {} },
                    { text: 'Exit', onPress: () => { BackHandler.exitApp() } }
                ]
            );
            return true;
        }

        const subscription = BackHandler.addEventListener('hardwareBackPress', handleBack);

        return () => {
            subscription.remove();
        };
    }, []);
    return (
        <View style={styles.fill}>
            <Image src={src} style={styles.image} />
            <Text style={styles.label}>Sample widget</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    fill: {
        alignSelf: 'stretch',
        backgroundColor: 'pink',
        flex: 1,
        padding: 10,
    },
    image: {
        width: 300,
        height: 200,
    },
    label: {
        color: 'green',
        fontSize: 24,
        padding: 20,
    },
});

export default Test;
