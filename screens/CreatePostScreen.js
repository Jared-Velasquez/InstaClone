import * as ImagePicker from "expo-image-picker";
//import { getApps, initializeApp } from "firebase/app";
import React from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
  LogBox,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TextInput,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import uuid from "uuid";

//Firebase imports
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db } from '../firebase/firebase';
import { getDoc, doc, addDoc, serverTimestamp, updateDoc, collection } from "firebase/firestore";

// Editing this file with fast refresh will reinitialize the app on every refresh, let's not do that
/*if (!getApps().length) {
  initializeApp(firebaseConfig);
}*/

// Firebase sets some timeers for a long period, which will trigger some warnings. Let's turn that off for this example
LogBox.ignoreLogs([`Setting a timer for a long period`]);

let widthImage = 0;
let heightImage = 0;

export default class CreatePostReplica extends React.Component {
  /*state = {
    image: null,
    uploading: false,
    description: '',
  };*/

  constructor() {
    super();

    this.state = {
      image: null,
      uploading: false,
      description: '',
    }
  }

  async componentDidMount() {
    if (Platform.OS !== "web") {
      const {
        status,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  }

  setDescription = (newText) => {
    //this.state.description = newText
    //console.log(this.state.description)
    this.setState({})
  }

  render() {
    let { image } = this.state;

    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ flex: 0.8 }} />
        <View style={{ flex: 1.35, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'black', justifyContent: 'left', alignItems: 'left', }}>
            <TouchableOpacity onPress={() => { this.props.navigation.goBack() }} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', borderRadius: 20, padding: 10, shadowColor: '#303838', shadowOffset: { width: 0, height: 5 }, shadowRadius: 10, shadowOpacity: 0.35, width: 70, height: 50, }}>
                <Image source={ require("/Users/jaredvelasquez/React-Native-Projects/InstagramClone/assets/images/backbutton.png") } />
            </TouchableOpacity>
            <View style={{ paddingLeft: 330 }}/>
        </View>
        <View style={{ flex: 17, alignItems: 'center', justifyContent: 'center' }}>
          <Button
            onPress={this._pickImage}
            title="Pick an image from camera roll"
          />
          
          {this._maybeRenderImage()}
          {this._maybeRenderUploadingOverlay()}
          <TextInput 
            style={styles.input}
            onChangeText={this.setDescription}
            placeholder='What are you thinking about?'
            value={this.state.description}
          />
          <StatusBar barStyle="default" />
        </View>
      </SafeAreaView>
    );
  }

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let { image } = this.state;
    if (!image) {
      return;
    }

    return (
      <View
        style={{
          marginTop: 30,
          width: Dimensions.get('window').width,
          borderRadius: 3,
          elevation: 2,
        }}
      >
        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: "rgba(0,0,0,1)",
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: "hidden",
          }}
        >
          <Image source={{ uri: image }} style={{ width: Dimensions.get('window').width, aspectRatio: 1.333 }} />
        </View>
      </View>
    );
  };

  _share = () => {
    Share.share({
      message: this.state.image,
      title: "Check out this photo",
      url: this.state.image,
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    alert("Copied image URL to clipboard");
  };

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log({ pickerResult });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async (pickerResult) => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        widthImage = pickerResult.width;
        heightImage = pickerResult.height;
        const uploadUrl = await uploadImageAsync(pickerResult.uri);
        this.setState({ image: uploadUrl });
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      this.setState({ uploading: false });
    }
  };
}

async function uploadImageAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const imageName = 'PostImages/' + uuid.v4();
  const fileRef = ref(getStorage(), imageName);
  const result = await uploadBytes(fileRef, blob);

  // We're done with the blob, close and release it
  blob.close();

  const urlDownload = await getDownloadURL(fileRef);

  const user = auth.currentUser;

  const userDocRef = doc(db, 'Users', user.email);
  const userDocSnap = await getDoc(userDocRef);
  const userDocData = userDocSnap.data();

  const postData = {
    Comments: [],
    Description: '',
    Image: urlDownload,
    Likes: [],
    Time: serverTimestamp(),
    Email: user.email,
    Username: userDocData.Username,
    Width: widthImage,
    Height: heightImage,
  }

  const postRef = await addDoc(collection(db, 'Posts'), postData);
  const strID = 'Post ID: ' + postRef.id;
  console.log(strID);

  const currentUserPosts = userDocData.UserPosts;
  currentUserPosts.push(postRef.id);

  updateDoc(userDocRef, {
    UserPosts: currentUserPosts,
  });

  return urlDownload;
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});