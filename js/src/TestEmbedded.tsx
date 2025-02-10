import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const src = "https://picsum.photos/id/366/400/300";
const src2 = "https://picsum.photos/id/487/400/300"

interface Props {
    backgroundColor: string;
    label: string;
    src: string;
}

function TestEmbedded({
    backgroundColor = 'lightblue',
    label = 'Sample embedded widget',
    src = 'https://picsum.photos/id/506/4561/3421',
}) {
    return (
        <View style={[styles.fill, { backgroundColor }]}>
            <Image src={src} style={styles.image} />
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    fill: {
        alignSelf: 'stretch',
        flex: 1,
        padding: 10,
    },
    image: {
        width: 300,
        height: 225,
    },
    label: {
        color: 'green',
        fontSize: 24,
        padding: 20,
    },
});

export default TestEmbedded;
