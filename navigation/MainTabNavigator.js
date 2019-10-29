import React from 'react'
import { Platform } from 'react-native'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import {createStackNavigator,} from 'react-navigation-stack'
import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import LinksScreen from '../screens/LinksScreen'
import SettingsScreen from '../screens/SettingsScreen'

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
})

const HomeStack = createStackNavigator(
  {
    Home:HomeScreen,
  },
  config
)

HomeStack.navigationOptions = {
  tabBarOptions: {
    activeTintColor: 'green',
    inactiveTintColor: 'white',
    inactiveBackgroundColor:'#a9b0ae',
    activeBackgroundColor: '#828282'
  },
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios' ? `ios-home${focused ? '' : '-outline'}` : 'md-home'
      }
    />
  ),
}

HomeStack.path = ''

const LinksStack = createStackNavigator(
  {
    Links: LinksScreen,
  },
  config
)

LinksStack.navigationOptions = {
  tabBarOptions: {
    activeTintColor: 'green',
    inactiveTintColor: 'white',
    inactiveBackgroundColor:'#a9b0ae',
    activeBackgroundColor: '#828282'
  },
  tabBarLabel: 'About',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-alert' : 'md-alert'} />
  ),
}

LinksStack.path = ''

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
)

SettingsStack.navigationOptions = {
  tabBarOptions: {
    activeTintColor: 'green',
    inactiveTintColor: 'white',
    inactiveBackgroundColor:'#a9b0ae',
    activeBackgroundColor: '#828282'
  },
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'} />
  ),
}

SettingsStack.path = ''

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
})

tabNavigator.path = ''

export default tabNavigator
