import 'react-native-gesture-handler'

import * as React from 'react';
import { StyleSheet } from 'react-native';

// Navigation Imports
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Icon Imports
import { AntDesign } from '@expo/vector-icons'

// Screen Imports
import FeedScreen from './screens/FeedScreen';
import SearchScreen from './screens/SearchScreen';
import AccountScreen from './screens/AccountScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CreatePostScreen from './screens/CreatePostTest';
import PostScreen from './screens/PostScreen';
import NonUserAccountScreen from './screens/NonUserAccountScreen';

// Redux Imports
import {createStore, applyMiddleware, subscribe} from 'redux';
import {Provider} from 'react-redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

store.subscribe(() => {
  console.log('state updated');
  //console.log(store.getState());
})

function App() {
  const defaultOptions = {
    headerShown: false,
    animation: 'none',
  }

  const FeedOptions = {
    tabBarOptions: { showIcon: true, },
    tabBarIcon: (focused, tintColor) => {
      return (<AntDesign name='home' size={30} color='black'/>)
    }
  }

  const SearchOptions = {
    tabBarOptions: { showIcon: true, },
    tabBarIcon: (focused, tintColor) => {
      return (<AntDesign name='search1' size={30} color='black'/>)
    }
  }

  const AccountOptions = {
    tabBarOptions: { showIcon: true, },
    tabBarIcon: (focused, tintColor) => {
      return (<AntDesign name='aliwangwang-o1' size={28} color='black'/>)
    }
  }

  function ToolbarScreens() {
    return (
      <Tab.Navigator screenOptions={defaultOptions}>
        <Tab.Screen name="Feed" component={FeedScreen} options={FeedOptions} />
        <Tab.Screen name="Search" component={SearchScreen} options={SearchOptions} />
        <Tab.Screen name="Account" component={AccountScreen} options={AccountOptions} />
      </Tab.Navigator>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={defaultOptions}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen 
            name="Home"
            component={ToolbarScreens}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Create Post" component={CreatePostScreen}/>
          <Stack.Screen name="Post Screen" component={PostScreen}/>
          <Stack.Screen name="Non User Account Screen" component={NonUserAccountScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;

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
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#303838',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
    width: 35,
    height: 35,
  },
  toolbarBottom: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 3,
    borderTopColor: 'black',
  },
  toolbarTop: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 3,
    borderBottomColor: 'black',
  }
});
