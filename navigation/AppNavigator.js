import { createAppContainer} from 'react-navigation'
import { createDrawerNavigator} from 'react-navigation-drawer'
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
import { Easing, Animated} from 'react-native'
const headerStyle = {
  marginTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 0
}
const transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 500,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
      const { layout, position, scene } = sceneProps;
 
      const thisSceneIndex = scene.index;
      const width = layout.initWidth;
 
      const translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [-width, 0],
        extrapolate: 'clamp'
      });
 
      return {
        transform: [{ translateX }]
      }
    }
  }
}
 const Stack = createStackNavigator({
    MainScreen: {
      screen: MainTabNavigator,
      navigationOptions: {
        header: null
      }
    },
})

const DrawerNavigator  = createDrawerNavigator({
  Main: {
    screen:Stack,
    },
  },{
  gesturesEnabled: false,
  contentComponent: DrawerScreen,
  drawerPosition: "right",
  drawerType:'slide',
  })

export default createAppContainer(
   createStackNavigator({
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        title: 'Sign In',
        headerStyle,
        headerStyle:{
          backgroundColor: '#a9b0ae'
        }
      }
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions: {
        title: 'Sign Up',
        headerStyle,
        headerStyle:{
          backgroundColor: '#a9b0ae'
        }
      }
    },
    Home: {
      screen: DrawerNavigator,
      navigationOptions: {
        header: null
      }
    },
    CreatePaylist: {
      screen: CreatePaylist,
      navigationOptions: {
        title: 'Create Paylist',
        headerStyle,
        headerStyle:{
          backgroundColor: '#a9b0ae'
        }
      }
    },
    UpdateUser: {
      screen: UpdateUser,
      navigationOptions: {
        title: 'Edit Data',
        headerStyle,
        headerStyle:{
          backgroundColor: '#a9b0ae'
        }
      }
    },
    UpdatePaylist: {
      screen: UpdatePaylist,
      navigationOptions: {
        title: 'Edit Data',
        headerStyle,
        headerStyle:{
          backgroundColor: '#a9b0ae'
        }
      }
    },
    AddBalance: {
      screen: AddBalance,
      navigationOptions:{
        title: 'Add Balance',
        headerStyle,
        headerStyle:{
          backgroundColor: '#a9b0ae'
        }
      }
    },
    EditPassword: {
      screen: EditPassword,
      navigationOptions:{
        title: 'Edit Password',
        headerStyle,
        headerStyle:{
          backgroundColor: '#a9b0ae'
        }
      }
    }
  },{
    transitionConfig
  })
)  