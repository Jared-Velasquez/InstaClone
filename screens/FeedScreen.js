import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Image, FlatList, Dimensions, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import Post from '../components/Post';

// Icon Imports
import { Ionicons } from '@expo/vector-icons'
import LoaderBlock from '../components/LoaderBlock';

// Utility Imports
import { getListUsersForFeed, queryPosts } from '../utilities/FeedLoader';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const SPACING = 20;
const SKELETON_WIDTH = Dimensions.get('window').width - 32;
const RENDER_STEP = 10;
let MAX_RENDER_AT_ONCE = 0;

function FeedScreen({ navigation }) {
    const [postData, setPostData] = useState([]); // Data of the posts that are rendering
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [postBlockList, setPostBlockList] = useState([{key: 1},{key: 2},{key:3},{key:4},{key:5}]);
    const [refreshing, setRefreshing] = useState(false);

    // If component is mounted
    const mountedRef = useRef(true);

    useEffect(() => {
        getPostsStep().catch(console.error);

        return () => {
            mountedRef.current = false;
        }
    }, [getPostsStep])

    const getPostsStep = useCallback(async () => {
        MAX_RENDER_AT_ONCE = MAX_RENDER_AT_ONCE + RENDER_STEP;
        getPosts().catch(console.error);
    })

    const getPosts = useCallback(async () => {
        //MAX_RENDER_AT_ONCE = MAX_RENDER_AT_ONCE + RENDER_STEP;
        const listUsers = await getListUsersForFeed();
        const queryProps = {limitShown: MAX_RENDER_AT_ONCE, users: listUsers};
        const posts = await queryPosts(queryProps).catch(console.error);

        if (!mountedRef.current) return null;

        setPostData(posts);
        setLoadingPosts(false);
    })

    const renderItem = (itemData) => {
        const postMetadata = itemData.item;
        return (
            <Post {...postMetadata}/>
        );
    }
    
    const renderBlocks = (itemData) => {
        return (
            <PostLoaderBlock />
        );
    }

    const _handleEndReached = () => {
        console.log('Loading more posts!');
        getPostsStep().catch(console.error);
    }

    const PostLoaderBlock = () => {
        return (
            <View style={styles.loaderContainer}>
                <LoaderBlock height={40} width={40} style={{ borderRadius: 20 }}/>
                <LoaderBlock 
                    height={(SKELETON_WIDTH / 16) * 9}
                    width={SKELETON_WIDTH}
                    style={{ borderRadius: 8, marginTop: 16 }}
                />
                <LoaderBlock 
                    height={10}
                    width={SKELETON_WIDTH}
                    style={{ borderRadius: 8, marginTop: 16 }}
                />
                <LoaderBlock 
                    height={10}
                    width={SKELETON_WIDTH}
                    style={{ borderRadius: 8, marginTop: 8 }}
                />
                <LoaderBlock 
                    height={10}
                    width={SKELETON_WIDTH}
                    style={{ borderRadius: 8, marginTop: 8 }}
                />
            </View>
        );
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getPosts().catch(console.error).then(() => setRefreshing(false));
    })

    if (loadingPosts) {
        return (
            <View style={styles.container}>
                <View style={styles.headerBuffer} />

                <View style={styles.toolbarTop}>
                    <Image source={require("/Users/jaredvelasquez/React-Native-Projects/InstagramClone/assets/images/newlogo.png")} style={styles.logo} />
                    
                    <View style={styles.spaceBetween} />
                    
                    <TouchableOpacity style={styles.buttonAdd} onPress={() => {
                        navigation.navigate('Create Post');
                    }}>
                        <Ionicons name='add-circle-outline' size={40} color='black' />
                    </TouchableOpacity>
                </View>

                <SafeAreaView style={styles.feed}>
                    <FlatList 
                        data={postBlockList}
                        renderItem={renderBlocks}
                        alwaysBounceVertical={false}
                        maxToRenderPerBatch={5}
                        initialNumToRender={2}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => {
                            console.log('End reached on skeleton FlatList!');
                        }}
                    />
                </SafeAreaView>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <View style={styles.headerBuffer} />
    
                <View style={styles.toolbarTop}>
                    <Image source={require("/Users/jaredvelasquez/React-Native-Projects/InstagramClone/assets/images/newlogo.png")} style={styles.logo} />
                    
                    <View style={styles.spaceBetween} />
                    
                    <TouchableOpacity style={styles.buttonAdd} onPress={() => {
                        navigation.navigate('Create Post');
                    }}>
                        <Ionicons name='add-circle-outline' size={40} color='black' />
                    </TouchableOpacity>
                </View>
                
                <SafeAreaView style={styles.feed}>
                    <FlatList
                        data={postData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id} 
                        alwaysBounceVertical={false}
                        maxtoRenderPerBatch={10}
                        initialNumToRender={5}
                        onEndReachedThreshold={0.2}
                        onEndReached={_handleEndReached}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[Colors.GreenLight]}
                                tintColor={Colors.GreenLight}
                            />
                        }
                    />
                </SafeAreaView>
            </View>
        );
    }
}

export default FeedScreen;

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
    logo: {
        flex: 10,
        justifyContent: 'flex-start',
        resizeMode: 'contain',
        width: Dimensions.get('window').width / 2,
        aspectRatio: 4.5,
        marginTop: 6,
    },
    buttonAdd: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 20,
        padding: 10,
        shadowColor: '#303838',
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        shadowOpacity: 0.35,
        width: 70,
        height: 60,
    },
    spaceBetween: {
        flex: 6,
    },
    headerBuffer: {
        flex: 0.8,
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
});