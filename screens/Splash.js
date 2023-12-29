import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native'

function SplashScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <LottieView 
                source={require('../assets/animations/49410-instagram-icon.json')}
                autoPlay
                loop={false}
                speed={0.5}
                onAnimationFinish={() => {
                    console.log('Animation Finished!');
                }}
            />
        </View>
    )
}

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})