import { createBrowserApp } from '@react-navigation/web'
import { createSwitchNavigator } from 'react-navigation'

import MainTabNavigator from './MainTabNavigator'

const switchNavigator = createSwitchNavigator({
  Main: MainTabNavigator,
})
switchNavigator.path = ''

export default createBrowserApp(switchNavigator, { history: 'hash' })
