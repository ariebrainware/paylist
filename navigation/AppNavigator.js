import React from 'react'
import { createAppContainer, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation'
import MainTabNavigator from './MainTabNavigator'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import { createStackNavigator } from 'react-navigation-stack'
import { Platform, StatusBar } from 'react-native'
import CreatePaylist from '../screens/CreatePaylist'
import UpdateUser from '../screens/UpdateUser'
import UpdatePaylist from '../screens/UpdatePaylist'

const headerStyle = {
  marginTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 0
}

export default createAppContainer(
  createStackNavigator({
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        title: 'Sign In',
        headerStyle
      }
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions: {
        title: 'Sign Up',
        headerStyle
      }
    },
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
    UpdatePaylist: {
      screen: UpdatePaylist,
      navigationOptions: {
        title: "Edit Data",
        headerStyle
      }
  },
  })
)