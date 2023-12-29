import { StyleSheet, TextInput, View, TouchableOpacity, Text, Image } from 'react-native'
import React, { useState } from 'react'
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import UserPermissions from '../utilities/UserPermissions'
import * as ImagePicker from 'expo-image-picker'
import uuid from 'uuid';

// Firebase Imports
import { auth, db } from '../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function RegisterScreen({ navigation }) {
    //const [fontsLoaded, setFontsLoaded] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg');


    let [fontsLoaded] = useFonts({
        'Pacifico': require('../assets/fonts/Pacifico-Regular.ttf'),
        'Quicksand': require('../assets/fonts/Quicksand-VariableFont_wght.ttf'),
    });

    function handleSignUp() {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('Registered with: ', user.email);

                let imageURL = null;

                uploadImageAsync(avatar).then((url) => {
                    imageURL = url;

                    const docData = {
                        Biography: '',
                        Followers: [],
                        Following: [],
                        ProfilePicture: avatar,
                        UserPosts: [],
                        Username: username,
                        Email: email,
                    }
                    setEmail(email.toLowerCase());
                    setDoc(doc(db, "Users", email.toLowerCase()), docData);
    
                    navigation.navigate('Home');
                })
            })
            .catch((error) => {
                console.log(error.message);
            })
    }

    async function uploadImageAsync(uri) {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            }
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            }
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        const imageName = 'Profile_Pictures/' + uuid.v4();
        const fileRef = ref(getStorage(), imageName);
        const result = await uploadBytes(fileRef, blob);

        blob.close();

        getDownloadURL(fileRef).then((url) => {
            return url;
        }).catch((error) => {
            console.log('catched: ' + error);
            return null;
        })
    }

    async function handlePickAvatar() {
        UserPermissions.getCameraPermission()

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
        })

        if (!result.cancelled) {
            setAvatar(result.uri);
        }
    }

    if (fontsLoaded) {
        return (
            <View style={ styles.container }>
                <View style={ styles.registerContainer }>
                    <Text style={ styles.registerText }>
                        Register
                    </Text>
                </View>

                <View style={{ position: 'absolute', top: 64, alignItems: 'center', width: '100%'}}>
                    <TouchableOpacity style={styles.avatarPlaceholder} onPress={handlePickAvatar}>
                        <Image source={{uri: avatar}} style={styles.avatar}/>
                        <Ionicons 
                            name='ios-add'
                            size={40}
                            color='#FFF'
                            style={{ marginTop: 6, marginLeft: 2 }}
                        ></Ionicons>
                    </TouchableOpacity>
                </View>

                <View style={ styles.inputContainer }>
                    <TextInput 
                        placeholder="Email"
                        value={ email }
                        onChangeText={text => setEmail(text)}
                        style={ styles.input }
                    />
                    <TextInput 
                        placeholder="Username"
                        value={ username }
                        onChangeText={text => setUsername(text)}
                        style={ styles.input }
                    />
                    <TextInput 
                        placeholder="Password"
                        value={ password }
                        onChangeText={text => setPassword(text)}
                        style={ styles.input }
                        secureTextEntry
                    />
                </View>
    
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleSignUp} style={ styles.button }>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
    
                <View style={ styles.alreadyHaveAccountContainer }>
                    <Text>
                        Already have an account? 
                    </Text>
                    <Text onPress={() => { navigation.navigate('Login') }} style={{ color: 'blue', marginLeft: 4 }}>Login</Text>
                </View>
            </View>
        );
    } else {
        return null;
    }
}

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    alreadyHaveAccountContainer: {
        width: '55%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    inputContainer: {
        width: '80%',
        marginBottom: 10,
    },
    input: {
        backgroundColor: 'transparent',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginTop: 5,
        marginBottom: 5,
        borderBottomColor: '#ff598f',
        borderBottomWidth: 1,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 25,
    },
    button: {
        backgroundColor: '#ff598f',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    registerText: {
        fontFamily: 'Pacifico',
        fontSize: 60,
        fontWeight: '700',
    },
    registerContainer: {
        justifyContent: 'left',
        width: '80%',
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: '#E1E2E6',
        borderRadius: 50,
        marginTop: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
    }
})