import React, {useEffect, useState} from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, FlatList, } from 'react-native'
import { useFonts } from 'expo-font'
import GestureRecognizer from 'react-native-swipe-gestures'

// Firebase imports
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

function PostScreen({route, navigation}) {
    const [avatar, setAvatar] = useState('https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg');
    const postData = route.params;

    useEffect(() => {
        let control = true;
        const getAvatar = async () => {
            const userEmail = postData.email;
            const userDocRef = doc(db, 'Users', userEmail);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                if (control) {
                    setAvatar(userData.ProfilePicture);
                }
            }
        }

        const setupFlatList = () => {

        }
        getAvatar()
            .catch(console.error);
        return () => {
            control = false;
        }
    }, [])
    
    let [fontsLoaded] = useFonts({
        'Montserrat': require('../assets/fonts/Montserrat-VariableFont_wght.ttf'),
        'Pacifico': require('../assets/fonts/Pacifico-Regular.ttf'),
        'Quicksand': require('../assets/fonts/Quicksand-VariableFont_wght.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

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
                    <View style={styles.usernameContainer}>
                        <Image source={{uri: avatar}} style={styles.avatar}/>
                        <Text style={styles.username}>{postData.username}</Text>
                    </View>

                    <View style={styles.imageContainer}>
                        <Image source={{uri: postData.postImage}} style={{width: Dimensions.get('window').width, aspectRatio: (postData.width) / (postData.height)}}/>
                    </View>
                </View>
            </GestureRecognizer>
        </View>
    );
}
//<Text style={styles.username}>{postData.username}</Text>

export default PostScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    usernameContainer: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 50,
    },
    username: {
        fontFamily: 'Pacifico',
        fontSize: 35,
        flex: 1,
        marginLeft: 50,
    },
    avatar: {
        //position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        //flex: 1,
        marginLeft: 25,
    },
    imageContainer: {
        flex: 7,
    }
})

const gestureConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
}