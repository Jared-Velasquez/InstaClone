import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState, useEffect } from 'react'
import { StyleSheet, TextInput, View, KeyboardAvoidingView, TouchableOpacity, Text, Image } from 'react-native'
import { auth } from '../firebase/firebase.js'
import { ReactNativeAsyncStorage } from 'firebase/auth';

// Redux Imports
import {useDispatch} from 'react-redux';
import { get_info } from '../redux/actions';

function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                console.log('User is already logged in!');
                dispatch(get_info());
                navigation.replace("Home");
            }
        })

        return unsubscribe
    }, [])

    function handleLogin() {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                dispatch(get_info());
                console.log('Logged in with: ', user.email);
            })
            .catch((error) => {
                console.log(error.message);
            })
    }

    return (
        <KeyboardAvoidingView style={ styles.container } behavior="padding">
            <View style={ styles.mainLogoContainer }>
                <Image style={ styles.mainLogo } source={require("/Users/jaredvelasquez/React-Native-Projects/InstagramClone/assets/images/mainlogo-white.png")} />
            </View>

            <View style={ styles.inputContainer }>
                <TextInput 
                    placeholder="Email"
                    value={ email }
                    onChangeText={text => setEmail(text)}
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
                <TouchableOpacity onPress={handleLogin} style={ styles.button }>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.replace('Register') }} style={ [styles.button, styles.buttonOutline] }>
                    <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: 'transparent',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginTop: 5,
        borderBottomColor: '#ff598f',
        borderBottomWidth: 1,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#ff598f',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#ff598f',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#ff598f',
        fontWeight: '700',
        fontSize: 16,
    },
    mainLogoContainer: {
        flex: 0.75
    },
    mainLogo: {
        width: 250,
        height: 260,
    }
})