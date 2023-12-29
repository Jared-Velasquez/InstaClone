import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Pressable } from 'react-native';
import SearchBar from '../components/SearchBar';

function SearchScreen({ navigation }) {
    const [searchText, setSearchText] = useState('');
    
    return (
        <View style={styles.container}>
            <View style={styles.headerBuffer} />
            <View style={styles.toolbarTop}>
                <SearchBar searchText={searchText} setSearchText={setSearchText}/>
            </View>

            <Text>
                Search Screen
            </Text>
            
            <View style={styles.feed}>

            </View>
        </View>
    );
}

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    feed: {
        flexDirection: 'column',
        flex: 15,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    toolbarTop: {
        flex: 1.3,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        justifyContent: 'left',
        alignItems: 'left',
    },
    spaceBetween: {
        flex: 6,
    },
    headerBuffer: {
        flex: 0.8,
    },
});

/*import React, { useState } from 'react';
import { Animated, SafeAreaView, StatusBar } from 'react-native';
import LoaderBlock from '../components/LoaderBlock';
import SearchBar from '../components/SearchBar';

const SearchScreen = () => {
    const [scrollYValue, setScrollYValue] = useState(new Animated.Value(0));
    const clampedScroll = Animated.diffClamp(
        Animated.add(
            scrollYValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolateLeft: 'clamp',
            }),
            new Animated.Value(0),
        ),
        0,
        50,
    );
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
        <Animated.View>
            <StatusBar barStyle='dark-content' />
            <SafeAreaView>
                <SearchBar clampedScroll={clampedScroll} />
                <Animated.ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        margin: 20,
                        backgroundColor: 'white',
                        paddingTop: 55
                    }}
                    contentContainerStyle={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-around',
                    }}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollYValue } } }],
                        { useNativeDriver: true },
                        () => {
                            
                        }
                    )}
                    contentInsetAdjustmentBehavior='automatic'
                >
                    {array.map(item => <LoaderBlock />)}
                </Animated.ScrollView>
            </SafeAreaView>
        </Animated.View>
    );
}

export default SearchScreen;*/