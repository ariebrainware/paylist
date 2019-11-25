import React from 'react'
import { Platform } from 'react-native'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import {createStackNavigator,} from 'react-navigation-stack'
import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import LinksScreen from '../screens/LinksScreen'
import SettingsScreen from '../screens/SettingsScreen'
import ReportScreen from '../screens/ReportScreen'

let config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
})

let HomeStack = createStackNavigator(
  {
    Home:HomeScreen,
  },
  config
)

HomeStack.navigationOptions = {
  tabBarOptions: {
    activeTintColor: '#54c470',
    inactiveTintColor: 'grey',
    inactiveBackgroundColor:'#eee',
    activeBackgroundColor: '#eee',
  },
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon 
      focused={focused}
      name={
        Platform.OS === 'ios' ? 'ios-home' : 'md-home'
      }
    />
  ),
}

HomeStack.path = ''

let ReportStack = createStackNavigator(
  {
    Report: ReportScreen,
  },
  config
)

ReportStack.navigationOptions = {
  tabBarOptions: {
    activeTintColor: '#54c470',
    inactiveTintColor: 'grey',
    inactiveBackgroundColor:'#eee',
    activeBackgroundColor: '#eee',
  },
  tabBarLabel: 'Report',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios' ? 'ios-archive' : 'md-archive'
      }
    />
  ),
}

ReportStack.path = ''

let LinksStack = createStackNavigator(
  {
    Links: LinksScreen,
  },
  config
)

LinksStack.navigationOptions = {
  tabBarOptions: {
    activeTintColor: '#54c470',
    inactiveTintColor: 'grey',
    inactiveBackgroundColor:'#eee',
    activeBackgroundColor: '#eee',
  },
  tabBarLabel: 'About',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-alert' : 'md-alert'} />
  ),
}

LinksStack.path = ''

let SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
)

SettingsStack.navigationOptions = {
  tabBarOptions: {
    activeTintColor: '#54c470',
    inactiveTintColor: 'grey',
    inactiveBackgroundColor:'#eee',
    activeBackgroundColor: '#eee',
  },
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'} />
  ),
}

SettingsStack.path = ''

let tabNavigator = createBottomTabNavigator({
  HomeStack,
  ReportStack,
  LinksStack,
  SettingsStack,
})

tabNavigator.path = ''

export default tabNavigator
