import React from 'react'
import { Platform } from 'react-native'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator, } from 'react-navigation-stack'
import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import Graphic from '../screens/Graphic'
import SettingsScreen from '../screens/SettingsScreen'
import ReportScreen from '../screens/ReportScreen'

let config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
})

let HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
)

HomeStack.navigationOptions = {
  tabBarOptions: {
    activeTintColor: '#ccbc58',
    inactiveTintColor: 'grey',
    inactiveBackgroundColor: '#2e2d2d',
    activeBackgroundColor: '#2e2d2d',
  },
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios" ? 'ios-home' : 'md-home'
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
    activeTintColor: '#ccbc58',
    inactiveTintColor: 'grey',
    inactiveBackgroundColor:'#2e2d2d',
    activeBackgroundColor: '#2e2d2d',
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

let GraphicStack = createStackNavigator(
  {
    Graphic: Graphic,
  },
  config
)

GraphicStack.navigationOptions = {
  tabBarOptions: {
    activeTintColor: '#ccbc58',
    inactiveTintColor: 'grey',
    inactiveBackgroundColor: '#2e2d2d',
    activeBackgroundColor: '#2e2d2d',
  },
  tabBarLabel: 'Graphic',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} 
    name={Platform.OS === 'ios' ? 'ios-stats' : 'md-stats'} />
  ),
}

GraphicStack.path = ''

let SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
)

SettingsStack.navigationOptions = {
  tabBarOptions: {
    activeTintColor: '#ccbc58',
    inactiveTintColor: 'grey',
    inactiveBackgroundColor: '#2e2d2d',
    activeBackgroundColor: '#2e2d2d',
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
  GraphicStack,
  SettingsStack,
})

tabNavigator.path = ''

export default tabNavigator
