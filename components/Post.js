import React, { useState, useEffect, useRef, memo } from 'react'
import { View, Text, Image, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Animated } from 'react-native';
import { useFonts } from 'expo-font';
import { auth, db } from '../firebase/firebase';
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons'
import { Instagram, Code } from 'react-content-loader';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import LoaderBlock from './LoaderBlock';

const SPACING = 20;

function Post({ comments, description, email, height, postImage, likes, time, username, width, id, liked, profilePicture }) {
    const [likedByUser, setLikedByUser] = useState(liked);
    const [progressLoaded, setProgressLoaded] = useState(0);

    useEffect(() => {
        handleFadeIn();
    }, [])

    const postData = {comments: comments, description: description, email: email, height: height, postImage: postImage, likes: likes, time: time, username: username, width: width, profilePicture: profilePicture};
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const skeWidth = Dimensions.get('window').width - 32;

    let [fontsLoaded] = useFonts({
        'Pacifico': require('../assets/fonts/Pacifico-Regular.ttf'),
        'Quicksand': require('../assets/fonts/Quicksand-VariableFont_wght.ttf'),
    });

    const handleFadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }

    const handleUsernamePress = () => {
        if (auth.currentUser.email === postData.email) {
            navigation.navigate('Account');
        } else {
            navigation.navigate('Non User Account Screen');
        }
    }

    const handleLike = () => {
        const postRef = doc(db, 'Posts', id);

        const user = auth.currentUser;
        let currentLikes = postData.likes;
        if (likedByUser) {
            setLikedByUser(false);
            const filteredLikes = currentLikes.filter(email => {
                return email !== user.email;
            })

            updateDoc(postRef, {
                Likes: filteredLikes,
            })
        } else {
            setLikedByUser(true);
            currentLikes.push(user.email);

            updateDoc(postRef, {
                Likes: currentLikes,
            });
        }
    }

    let lastTap = null;

    const handleDoubleTap = () => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
            handleLike();
        } else {
            lastTap = now;
        }
    }

    const handleComment = () => {
        console.log('Commented!');
    }

    const handleLongPress = () => {
        navigation.navigate('Post Screen', {
            ...postData,
        });
    }

    const PostLoaderBlock = () => {
        return (
            <View style={styles.loaderContainer}>
                <LoaderBlock height={40} width={40} style={{ borderRadius: 20 }}/>
                <LoaderBlock 
                    height={(skeWidth / 16) * 9}
                    width={skeWidth}
                    style={{ borderRadius: 8, marginTop: 16 }}
                />
                <LoaderBlock 
                    height={10}
                    width={skeWidth}
                    style={{ borderRadius: 8, marginTop: 16 }}
                />
                <LoaderBlock 
                    height={10}
                    width={skeWidth}
                    style={{ borderRadius: 8, marginTop: 8 }}
                />
                <LoaderBlock 
                    height={10}
                    width={skeWidth}
                    style={{ borderRadius: 8, marginTop: 8 }}
                />
            </View>
        );
    }

    if (fontsLoaded && postData) {
        if ((postData.width === 0) || (postData.height === 0)) {
            return null;
        } else {
            return (
                <Animated.View
                    style={[
                        styles.container,
                        {
                            opacity: fadeAnim
                        }
                    ]}
                >
                    <View style={styles.profileContainer}>
                        <Image source={{uri: postData.profilePicture}} style={styles.profilePicture} />
                        <Text onPress={handleUsernamePress} style={{fontFamily: 'Quicksand', color: 'black', fontSize: 17, fontWeight: 'bold',}}> {postData.username} </Text>
                    </View>
                    <TouchableWithoutFeedback onPress={handleDoubleTap} onLongPress={handleLongPress}>
                        <View>
                            <Image source={{uri: postData.postImage}} style={{width: (Dimensions.get('window').width - SPACING - SPACING/5), aspectRatio: (postData.width) / (postData.height)}}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.likeContainer}>
                        <TouchableOpacity onPress={handleLike}>
                            <Image 
                                source={(likedByUser) ? require('../assets/images/Heart/heart.png') : require('../assets/images/Heart/heart-outline.png')}
                                style={styles.heartIcon}
                                resizeMode='cover'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleComment} style={styles.commentIcon}>
                            <Ionicons name='ios-chatbubbles-outline' size={30} color='black' />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={styles.descriptionContainer}> {postData.description} </Text>
                    </View>
                </Animated.View>
            );
        }
    } else {
        return (
            <PostLoaderBlock />
        );
    }
}

export default memo(Post);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        //alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: .3,
        shadowRadius: 20,
        padding: 5,
        marginBottom: SPACING,
        marginLeft: SPACING/4,
        marginRight: SPACING/4,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 12,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        //alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: .3,
        shadowRadius: 20,
        padding: 10,
        marginBottom: SPACING,
        marginLeft: SPACING/4,
        marginRight: SPACING/4,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 12,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        marginBottom: SPACING/4,
    },
    likeContainer: {
        flexDirection: 'row',
        alignContent: 'flex-start',
        padding: 3,
    },
    heartIcon: {
        width: 35,
        height: 35,
    },
    commentIcon: {
        marginLeft: 20,
        marginRight: 275,
    },
    descriptionContainer: {
        padding: 5,
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
    }
});