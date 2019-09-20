import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { createStackNavigator } from 'react-navigation-stack';

export default createAppContainer(
  createStackNavigator({
    //You could add another route here for authentication.
    //Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Login: LoginScreen,
    Register: RegisterScreen,
    Main: MainTabNavigator
  })
  );