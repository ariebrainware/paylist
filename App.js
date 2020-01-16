import React,{} from 'react'
import {StyleSheet, View, Image, Dimensions } from 'react-native'

import AppNavigator from './navigation/AppNavigator'
import { Provider } from 'mobx-react'
import Initial from './State'
let width = Dimensions.get('window').width
let height = Dimensions.get('window').height

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      loading: true
    }
  }

componentDidMount() {
  setTimeout(()=>{
    this.setState({loading: false})
  },2000)
}

  render() {
    if(this.state.loading){
      return (
        <View>
          <Image source={require('./assets/images/splash.png')} style={{width: width, height:height}}>
          </Image>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <Provider store={Initial}>
           <AppNavigator />
          </Provider>
        </View>
      )
    }
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
})
