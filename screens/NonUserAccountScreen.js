import React from 'react';
import {View, Text, StyleSheet} from 'react-native'
import GestureRecognizer from 'react-native-swipe-gestures'

function NonUserAccountScreen({ navigation }) {
    function onSwipeLeft(gestureState) {
        navigation.goBack();
    }

    function onSwipeRight(gestureState) {
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <GestureRecognizer
                onSwipeLeft={onSwipeLeft}
                onSwipeRight={onSwipeRight}
                config={gestureConfig}
            >
                <View style={styles.container}>
                    <Text>Test</Text>
                </View>
            </GestureRecognizer>
        </View>
    );
}

export default NonUserAccountScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

const gestureConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
}