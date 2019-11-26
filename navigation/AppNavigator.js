import { createAppContainer } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer'
import MainTabNavigator from './MainTabNavigator'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import { createStackNavigator } from 'react-navigation-stack'
import { Platform, StatusBar } from 'react-native'
import CreatePaylist from '../screens/CreatePaylist'
import UpdateUser from '../screens/UpdateUser'
import UpdatePaylist from '../screens/UpdatePaylist'
import AddBalance from '../screens/AddBalance'
import EditPassword from '../screens/EditPassword'
import DrawerScreen from '../screens/Drawer'
import { Easing, Animated } from 'react-native'
import ReportDetails from '../screens/ReportDetails'
let headerStyle = {
  marginTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 0
}
let transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 500,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
      let { layout, position, scene } = sceneProps

      let thisSceneIndex = scene.index
      let width = layout.initWidth

      let translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [-width, 0],
        extrapolate: 'clamp'
      })

      return {
        transform: [{ translateX }]
      }
    }
  }
}

let DrawerNavigator = createDrawerNavigator({
  Main: {
    screen: MainTabNavigator
  },
}, {
  gesturesEnabled: false,
  contentComponent: DrawerScreen,
  drawerPosition: 'right',
  drawerType: 'slide',
  headerStyle,
})

export default createAppContainer(
  createStackNavigator({
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        title: 'Sign In',
        headerTitleStyle: {
          fontSize: 19,
          textAlign: 'center'
        },
        headerStyle,
        headerStyle: {
          backgroundColor: '#a9b0ae'
        }
      }
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions: {
        title: 'Sign Up',
        headerTitleStyle: {
          fontSize: 19,
          textAlign: 'center'
        },
        headerStyle,
        headerStyle: {
          backgroundColor: '#a9b0ae'
        }
      }
    },
    Home: {
      screen: DrawerNavigator,
      navigationOptions: {
        header: null,
      }
    },
    CreatePaylist: {
      screen: CreatePaylist,
      navigationOptions: {
        title: 'Create Paylist',
        headerTitleStyle: {
          fontSize: 19,
          textAlign: 'center'
        },
        headerStyle,
        headerStyle: {
          backgroundColor: '#a9b0ae'
        }
      }
    },
    UpdateUser: {
      screen: UpdateUser,
      navigationOptions: {
        title: 'Edit Data',
        headerTitleStyle: {
          fontSize: 19,
          textAlign: 'center'
        },
        headerStyle,
        headerStyle: {
          backgroundColor: '#a9b0ae'
        }
      }
    },
    UpdatePaylist: {
      screen: UpdatePaylist,
      navigationOptions: {
        title: 'Edit Data',
        headerTitleStyle: {
          fontSize: 19,
          textAlign: 'center'
        },
        headerStyle,
        headerStyle: {
          backgroundColor: '#a9b0ae'
        }
      }
    },
    AddBalance: {
      screen: AddBalance,
      navigationOptions: {
        title: 'Add Balance',
        headerTitleStyle: {
          fontSize: 19,
          textAlign: 'center'
        },
        headerStyle,
        headerStyle: {
          backgroundColor: '#a9b0ae'
        }
      }
    },
    EditPassword: {
      screen: EditPassword,
      navigationOptions: {
        title: 'Edit Password',
        headerTitleStyle: {
          fontSize: 19,
          textAlign: 'center'
        },
        headerStyle,
        headerStyle: {
          backgroundColor: '#a9b0ae'
        }
      }
    },
    ReportDetail: {
      screen: ReportDetails,
      navigationOptions: {
        title: 'Report Detail',
        headerTitleStyle: {
          fontSize: 19,
          textAlign: 'center'
        },
        headerStyle: {
          backgroundColor: '#a9b0ae'
        }
      }
    }
  }, {
    transitionConfig
  })
)  