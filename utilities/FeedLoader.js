// https://blog.logrocket.com/react-suspense-data-fetching/#what-is-react-suspense

import React, { useState } from 'react';
import { getDoc, doc, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { auth, db } from '../firebase/firebase';

export async function getListPosts() {
    //const [postIDs, setPostIDs] = useState([]);

    const user = auth.currentUser;
    if (user) {
        const userDocRef = doc(db, 'Users', user.email);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();

            // Start off postsShown with the posts of the user
            let postsShownIDs = userData.UserPosts;

            // Append to postsShown the posts of all the users this user follows
            const following = userData.Following;
            for (let i = 0; i < following.length; i++) {
                const followingDocRef = doc(db, 'Users', following[i]);
                const followingDocSnap = await getDoc(followingDocRef);

                if (followingDocSnap.exists()) {
                    const followingDocData = followingDocSnap.data();

                    const followingPosts = followingDocData.UserPosts;
                    
                    // Add following's posts to the posts shown
                    for (let j = 0; j < followingPosts.length; j++) {
                        postsShownIDs.push(followingPosts[j]);
                    }
                } else {
                    console.log('Follower does not exist!');
                }
            }

            return postsShownIDs;
        } else {
            console.log('User document does not exist!');
        }
    } else {
        console.log('User is not logged in!');
    }
}

export async function getPostData(postList) {
    const user = auth.currentUser;
    let postDataList = [];
    if (postList.length !== 0) {
        for (let i = 0; i < postList.length; i++) {
            const postRef = doc(db, 'Posts', postList[i]);
            const postSnap = await getDoc(postRef);
            if (postSnap.exists()) {
                const postData = postSnap.data();
                let liked = false;
                const userLiked = postData.Likes.find(email => {
                    return email === user.email;
                })
                if (userLiked) {
                    liked = true;
                }

                // Get profile picture of the user
                let userProfilePicture = 'https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg';
                const userPostRef = doc(db, 'Users', postData.Email);
                const userPostSnap = await getDoc(userPostRef);
                if (userPostSnap.exists()) {
                    const userPostData = userPostSnap.data();
                    userProfilePicture = userPostData.ProfilePicture;
                }

                const postMetadata = {
                    comments: postData.Comments,
                    description: postData.Description,
                    email: postData.Email,
                    height: postData.Height,
                    postImage: postData.Image,
                    likes: postData.Likes,
                    time: postData.Time,
                    username: postData.Username,
                    width: postData.Width, 
                    id: postList[i],
                    liked: liked,
                    profilePicture: userProfilePicture,
                }
                postDataList.push(postMetadata);
            } else {
                console.log('Post ' + postList[i] + ' does not exist');
            }
        }

        return postDataList;
    } else {
        console.log('No posts in feed!');
    }
}

export async function getListUsersForFeed() {
    const user = auth.currentUser;
    if (user) {
        const userDocRef = doc(db, 'Users', user.email);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();

            // Append to postsShown the posts of all the users this user follows
            let listUsers = userData.Following;
            listUsers.push(user.email);

            return listUsers;
        } else {
            console.log('User document does not exist!');
        }
    } else {
        console.log('User is not logged in!');
    }
}

export async function queryPosts({limitShown, users}) {
    const postRef = collection(db, 'Posts');
    const userRef = collection(db, 'Users');
    const user = auth.currentUser;

    // Create a query against the collection
    const queryPost = query(postRef, where('Email', 'in', users), orderBy('Time', 'desc'), limit(limitShown));
    const queryPostSnapshot = await getDocs(queryPost);
    let postData = [];
    queryPostSnapshot.forEach((doc) => {
        const docData = doc.data();

        // Lower-case document
        docData.comments = docData.Comments;
        docData.description = docData.Description;
        docData.email = docData.Email;
        docData.height = docData.Height;
        docData.postImage = docData.Image;
        docData.likes = docData.Likes;
        docData.time = docData.Time;
        docData.username = docData.Username;
        docData.width = docData.Width;

        // Delete upper-case fields
        delete docData.Comments;
        delete docData.Description;
        delete docData.Email;
        delete docData.Height;
        delete docData.Image;
        delete docData.Likes;
        delete docData.Time;
        delete docData.Username;
        delete docData.Width;

        // Set id of document
        docData.id = doc.id;

        // Set if current user liked this post
        let liked = false;
        const userLiked = docData.likes.find(email => {
            return email === user.email;
        })
        if (userLiked) {
            liked = true;
        }
        docData.liked = liked;

        postData.push(docData);
    })

    for (let i = 0; i < postData.length; i++) {
        /*const userPostRef = doc(db, 'Users', postData[i].email);;
        const userPostSnap = await getDoc(userPostRef);
        if (userPostSnap.exists()) {
            const userPostData = userPostSnap.data();
            postData[i].profilePicture = userPostData.ProfilePicture;
        }*/

        const userRef = collection(db, 'Users');
        const queryUser = query(userRef, where('Email', '==', postData[i].email));
        const queryUserSnapshot = await getDocs(queryUser);

        let userData = {};

        queryUserSnapshot.forEach((doc) => {
            userData = doc.data();
            postData[i].profilePicture = userData.ProfilePicture;
        })
    }

    return postData;
}

export async function queryAccountPosts(email) {
    // Get Post Documents
    const postRef = collection(db, 'Posts');
    const queryPost = query(postRef, where('Email', '==', email), orderBy('Time', 'desc'));
    const queryPostSnapshot = await getDocs(queryPost);
    let postData = [];
    queryPostSnapshot.forEach((doc) => {
        const docData = doc.data();

        // Lower-case document
        docData.comments = docData.Comments;
        docData.description = docData.Description;
        docData.email = docData.Email;
        docData.height = docData.Height;
        docData.postImage = docData.Image;
        docData.likes = docData.Likes;
        docData.time = docData.Time;
        docData.username = docData.Username;
        docData.width = docData.Width;

        // Delete upper-case fields
        delete docData.Comments;
        delete docData.Description;
        delete docData.Email;
        delete docData.Height;
        delete docData.Image;
        delete docData.Likes;
        delete docData.Time;
        delete docData.Username;
        delete docData.Width;

        // Set id of document
        docData.id = doc.id;

        // Set if current user liked this post
        let liked = false;
        const userLiked = docData.likes.find(emailElement => {
            return emailElement === email;
        })
        if (userLiked) {
            liked = true;
        }
        docData.liked = liked;

        postData.push(docData);
    });


    // Get User Document
    const userRef = collection(db, 'Users');
    const queryUser = query(userRef, where('Email', '==', email));
    const queryUserSnapshot = await getDocs(queryUser);

    let userData = {};

    queryUserSnapshot.forEach((doc) => {
        userData = doc.data();

        for (let i = 0; i < postData.length; i++) {
            postData[i].profilePicture = userData.ProfilePicture;
        }
    })

    return {
        'postData': postData,
        'userData': userData,
    }
}