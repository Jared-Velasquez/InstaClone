import React, { useEffect, useRef } from 'react'
import { Image, Dimensions, StyleSheet, TouchableOpacity, Animated } from 'react-native'
import { useNavigation } from '@react-navigation/native'

// Want three SmallPosts per FlatList row
const photoLength = (Dimensions.get('window').width) / 3

function SmallPost({ comments, description, email, height, postImage, likes, time, username, width, id, liked, profilePicture }) {
    useEffect(() => {
        handleFadeIn();
    }, []);

    const navigation = useNavigation();
    const postData = {comments: comments, description: description, email: email, height: height, postImage: postImage, likes: likes, time: time, username: username, width: width, profilePicture: profilePicture};
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const handlePostPress = () => {
        navigation.navigate('Post Screen', {
            ...postData,
        });
    }

    const handleFadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }

    return (
        <Animated.View 
            style={[
                styles.container,
                {
                    opacity: fadeAnim
                }
            ]}
        >
            <TouchableOpacity onPress={handlePostPress}>
                <Image source={{uri: postImage}} style={styles.smallImage} />
            </TouchableOpacity>
        </Animated.View>
    )
}

export default SmallPost;

const styles = StyleSheet.create({
    smallImage: {
        width: photoLength,
        height: photoLength,
    }
})