import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LoaderBlock = ({width, height, style}) => {
    const translateX = useRef(new Animated.Value(-width)).current;
    const RandomNumber = Math.floor(Math.random() * 100) + 1;
    const percentAnimated = 100;

    useEffect(() => {
        // Only about half of the LoaderBlock components will be animated
        if ((1 <= RandomNumber) && (RandomNumber <= percentAnimated)) {
            Animated.loop(
                Animated.timing(translateX, {
                    toValue: width,
                    useNativeDriver: true,
                    duration: 1000,
                    
                })
            ).start();
        }
    }, [width])

    return (
        <View 
            style={StyleSheet.flatten([{width: width, height: height, backgroundColor: 'rgba(0,0,0,0.12)', overflow: 'hidden'},
            style
            ])}
        >
            <Animated.View 
                style={{
                    width: '100%', 
                    height: '100%',
                    transform: [{ translateX: translateX }]
                }}
            >
                <LinearGradient 
                    style={{width: '100%', height: '100%'}}
                    colors={['transparent', 'rgba(0, 0, 0, 0.05)', 'transparent']}
                    start={{ x: 1, y: 1 }}
                />
            </Animated.View>
        </View>
    );
}

export default LoaderBlock;