import React from 'react';
import { createAppContainer, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { createStackNavigator } from 'react-navigation-stack';
import { Platform, StatusBar } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import CreatePaylist from '../screens/CreatePaylist';
import UpdateUser from '../screens/UpdateUser';

const headerStyle = {
  marginTop: Platform.OS === "ios" ? StatusBar.currentHeight : 0
};

export default createAppContainer(
  createStackNavigator({
    //You could add another route here for authentication.
    //Read more at https://reactnavigation.org/docs/en/auth-flow.html
    // Login: {
    // screen: LoginScreen,
    // navigationOptions: {
    //   title: "Sign In",
    //   headerStyle
    //  }
    // },
    // Register: {
    //   screen: RegisterScreen,
    //   navigationOptions: {
    //     title: "Sign Up",
    //     headerStyle
    //   }
    // },
    Main: {
      screen: MainTabNavigator,
      navigationOptions: {
        header: null
      }
    },
    CreatePaylist: {
        screen: CreatePaylist,
        navigationOptions: {
          title: "Create Paylist",
          headerStyle
        }
      },
    UpdateUser: {
        screen: UpdateUser,
        navigationOptions: {
          title: "Edit Data",
          headerStyle
        }
    },  
  })
)