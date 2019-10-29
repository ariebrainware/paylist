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

const headerStyle = {
  marginTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 0
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
        headerStyle
      }
    },
    UpdateUser: {
      screen: UpdateUser,
      navigationOptions: {
        title: 'Edit Data',
        headerStyle
      }
    },
    UpdatePaylist: {
      screen: UpdatePaylist,
      navigationOptions: {
        title: 'Edit Data',
        headerStyle
      }
    },
    AddBalance: {
      screen: AddBalance,
      navigationOptions:{
        title: 'Add Balance',
        headerStyle
      }
    },
    EditPassword: {
      screen: EditPassword,
      navigationOptions:{
        title: 'Edit Password',
        headerStyle
      }
    }
  })
)  