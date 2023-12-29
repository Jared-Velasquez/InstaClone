import React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import {AntDesign} from '@expo/vector-icons';

const SearchBar = (props) => {
    return (
        <View style={styles.container}>
            <TextInput 
                placeholder='Search for friends!'
                style={styles.input}
                value={props.searchText}
                onChangeText={(text) => props.setSearchText(text)}
            />
        </View>
    );
}

export default SearchBar;

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    input: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        color: '#000',
        borderWidth: 1,
    },

})