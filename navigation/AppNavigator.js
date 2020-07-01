import { createAppContainer } from "react-navigation"
import { createDrawerNavigator } from "react-navigation-drawer"
import MainTabNavigator from "./MainTabNavigator"
import LoginScreen from "../screens/LoginScreen"
import RegisterScreen from "../screens/RegisterScreen"
import { createStackNavigator } from "react-navigation-stack"
import { Platform, StatusBar } from "react-native"
import CreatePaylist from "../screens/CreatePaylist"
import UpdatePaylist from "../screens/UpdatePaylist"
import EditInc from "../screens/EditIncome"
import EditPassword from "../screens/EditPassword"
import DrawerScreen from "../screens/Drawer"
import About from "../screens/LinksScreen"

import { Easing, Animated, Dimensions } from "react-native"
import ReportDetails from "../screens/ReportDetails"
let headerStyle = {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
}
let width = Dimensions.get("window").width

let transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 500,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: sceneProps => {
      let { layout, position, scene } = sceneProps

      let thisSceneIndex = scene.index
      let width = layout.initWidth

      let translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [-width, 0],
        extrapolate: "clamp"
      })

      return {
        transform: [{ translateX }]
      }
    }
  }
}

let DrawerNavigator = createDrawerNavigator(
  {
    Main: {
      screen: MainTabNavigator
    }
  },
  {
    gesturesEnabled: false,
    contentComponent: DrawerScreen,
    drawerPosition: "right",
    drawerType: "slide",
    headerStyle,
    drawerWidth: width / 1.6,
  }
)

export default createAppContainer(
  createStackNavigator(
    {
      Login: {
        screen: LoginScreen,
        navigationOptions: {
          header: null
        }
      },
      Register: {
        screen: RegisterScreen,
        navigationOptions: {
          header: null
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
          headerTitleStyle: {
            fontSize: 19,
            textAlign: 'center'
          },
          headerStyle,
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#2e2d2d",
            shadowColor: "transparent",
            elevation: 0,
            borderBottomWidth: 0.5,
            borderBottomColor: "#70706e"
          }
        }
      },
      UpdatePaylist: {
        screen: UpdatePaylist,
        navigationOptions: {
          title: "Edit Data",
          headerTitleStyle: {
            fontSize: 19,
            textAlign: "center"
          },
          headerStyle,
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#2e2d2d",
            shadowColor: "transparent",
            elevation: 0,
            borderBottomWidth: 0.5,
            borderBottomColor: "#70706e"
          }
        }
      },
      EditPassword: {
        screen: EditPassword,
        navigationOptions: {
          title: "Edit Password",
          headerTitleStyle: {
            fontSize: 19,
            textAlign: "center"
          },
          headerStyle,
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: "#2e2d2d",
            shadowColor:'transparent', 
            elevation:0,
            borderBottomWidth:0.5,
            borderBottomColor: '#70706e'
          }
        }
      },
      ReportDetail: {
        screen: ReportDetails,
        navigationOptions: {
          title: "Report Detail",
          headerTitleStyle: {
            fontSize: 19,
            textAlign: "center"
          },
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#2e2d2d",
            shadowColor: "transparent",
            elevation: 0,
            borderBottomWidth: 0.5,
            borderBottomColor: "#70706e"
          }
        }
      },
      EditInc: {
        screen: EditInc,
        navigationOptions: {
          title: "Edit Income",
          headerTitleStyle: {
            fontSize: 19,
            textAlign: "center"
          },
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#2e2d2d",
            shadowColor: "transparent",
            elevation: 0,
            borderBottomWidth: 0.5,
            borderBottomColor: "#70706e"
          }
        }
      },
      About:{
        screen:About,
        navigationOptions: {
          title: "About",
          headerTitleStyle: {
            fontSize: 19,
            textAlign: "center"
          },
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#2e2d2d",
            shadowColor: "transparent",
            elevation: 0,
            borderBottomWidth: 0.5,
            borderBottomColor: "#70706e"
          }
        }
      }
    },
    {
      transitionConfig
    }
  )
)
