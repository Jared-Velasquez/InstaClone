import React, { useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import { useFonts } from 'expo-font'

// Navigation Imports
import { createDrawerNavigator } from '@react-navigation/drawer'
import { DrawerActions, NavigationContainer } from '@react-navigation/native'

// Icon Imports
import { AntDesign } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons';

// Components Imports
import SmallPost from '../components/SmallPost';

// Firebase Imports
import { auth, db } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Utility Imports
import { queryAccountPosts } from '../utilities/FeedLoader';

// Redux Imports
import {useSelector} from 'react-redux';

function AccountScreen({ navigation }) {
    const [posts, setPosts] = useState([]);

    // User Data
    const [username, setUsername] = useState('');
    const [postNumber, setPostNumber] = useState(0);
    const [followerNumber, setFollowerNumber] = useState(0);
    const [followingNumber, setFollowingNumber] = useState(0);
    const [avatar, setAvatar] = useState('https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg');

    const accountData = useSelector(state => state.accountInfo);

    // If component is mounted
    const mountedRef = useRef(true);

    useEffect(() => {
        console.log('USE EFFECT')
        const postData = accountData.postData;
        const userData = accountData.userData;

        console.log(userData);

        if (!mountedRef.current) return null;
        
        console.log('SET STATES')
        
        setPosts(postData);
        setUsername(userData.Username);
        setPostNumber(userData.UserPosts.length);
        setFollowerNumber(userData.Followers.length);
        setFollowingNumber(userData.Following.length);
        setAvatar(userData.ProfilePicture);

        return () => {
            mountedRef.current = false;
        }
    }, [accountData]);

    /*useEffect(() => {
        getData().catch(console.error);

        return () => {
            mountedRef.current = false;
        }
    }, [getData]);

    const getData = useCallback(async () => {
        const user = auth.currentUser;
        const data = await queryAccountPosts(user.email);

        const postData = data.postData;
        const userData = data.userData;

        if (!mountedRef.current) return null;
        
        setPosts(postData);
        setUsername(userData.Username);
        setPostNumber(userData.UserPosts.length);
        setFollowerNumber(userData.Followers.length);
        setFollowingNumber(userData.Following.length);
        setAvatar(userData.ProfilePicture);
    });*/

    let [fontsLoaded] = useFonts({
        'Montserrat': require('../assets/fonts/Montserrat-VariableFont_wght.ttf'),
        'Pacifico': require('../assets/fonts/Pacifico-Regular.ttf'),
        'Quicksand': require('../assets/fonts/Quicksand-VariableFont_wght.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    function handleSignOut() {
        signOut(auth)
            .then(() => {
                navigation.replace("Login")
            })
            .catch(error => alert(error.message))
    }

    function renderItem(itemData) {
        const postMetadata = itemData.item;
        return (
            <SmallPost {...postMetadata}/>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerBuffer} />
            <View style={styles.toolbarTop}>
                <View style={ styles.emailContainer }>
                    <Text style={ styles.email }>{username}</Text>
                </View>
                <View style={ styles.spaceBetween } />
                <TouchableOpacity style={styles.logOutButton} onPress={handleSignOut}>
                    <AntDesign name='bars' size={30} color='black' />
                </TouchableOpacity>
            </View>

            <View style={styles.detailsContainer}>
                <TouchableOpacity style={styles.avatarPlaceholder}>
                    <Image source={{uri: avatar}} style={styles.avatar}/>
                </TouchableOpacity>

                <View style={styles.numbersContainer}>
                    <View style={styles.numbers}>
                        <Text style={styles.numberText}>{postNumber}</Text>
                        <Text>Posts</Text>
                    </View>

                    <TouchableOpacity style={styles.numbers}>
                        <Text style={styles.numberText}>{followerNumber}</Text>
                        <Text>Followers</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.numbers}>
                        <Text style={styles.numberText}>{followingNumber}</Text>
                        <Text>Following</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.feed}>
                <FlatList
                    data={posts}
                    renderItem={renderItem}
                    numColumns={3}
                />
            </View>
        </View>
    );
}

export default AccountScreen;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailsContainer: {
        flex: 4,
        flexDirection: 'row',
    },
    numbersContainer: {
        marginLeft: 50,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    numbers: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
    },
    numberText: {
        fontWeight: '600',
    },
    feed: {
        flexDirection: 'column',
        flex: 11,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: 'black',
    },
    toolbarTop: {
        flex: 1.35,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emailContainer: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    email: {
        fontFamily: 'Pacifico',
        fontSize: 35,
    },
    logo: {
        flex: 10,
        justifyContent: 'flex-start',
        resizeMode: 'contain',
    },
    spaceBetween: {
        flex: 5,
    },
    headerBuffer: {
        flex: 0.8,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: '#E1E2E6',
        borderRadius: 50,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    logOutButton: {
        marginRight: 20
    }
});