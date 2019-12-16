import React, {} from 'react'
import {StyleSheet, View, Image, Text } from 'react-native'

import AppNavigator from './navigation/AppNavigator'
import { Provider } from 'mobx-react'
import Initial from './State'

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      loading:false
    }
  }
  render() {
    return (
      <View style={styles.container}>
         <Provider store={Initial}>
           <AppNavigator />
        </Provider>
      </View>
    )
    }
  }
// export default function App(props) {
//   let [isLoadingComplete, setLoadingComplete] = useState(false)

//   if (!isLoadingComplete && !props.skipLoadingScreen) {
//     return (
//       <AppLoading
//         startAsync={loadResourcesAsync}
//         onError={handleLoadingError}
//         onFinish={() => handleFinishLoading(setLoadingComplete)}
//       />
//     )
//   } else {
//     return (
//       <View style={styles.container}>
//         {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
//         <Provider store={Initial}>
//           <AppNavigator />
//         </Provider>
//         </View>
//     )
//   }
// }

// async function loadResourcesAsync() {
//   await Promise.all([
//     // Asset.loadAsync([
//     //   require('./assets/images/add-button.png'),
//     // ]),
//     Font.loadAsync({
//       // This is the font that we are using for our tab bar
//       ...Ionicons.font,
//       // We include SpaceMono because we use it in HomeScreen.js. Feel free to
//       // remove this if you are not using it in your app
//       'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
//     }),
//   ])
// }

// function handleLoadingError(error) {
//   // In this case, you might want to report the error to your error reporting
//   // service, for example Sentry
//   console.warn(error)
// }

// function handleFinishLoading(setLoadingComplete) {
//   setLoadingComplete(true)
// }

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
})
