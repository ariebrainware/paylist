import React,{} from 'react'
import {StyleSheet, View, Image, Dimensions,Text } from 'react-native'
import AppNavigator from './navigation/AppNavigator'
import { Provider } from 'mobx-react'
import Initial from './State'
import AppIntroSlider from 'react-native-app-intro-slider'
import AsyncStorage from '@react-native-community/async-storage'

let width = Dimensions.get('window').width
let height = Dimensions.get('window').height

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      loading: true,
      intro:false
    }
  }


componentDidMount() {
  setTimeout(()=>{
    this.setState({loading: false})
  },2000)
  AsyncStorage.getItem('value').then((value)=>{
    this.setState({intro: !!value})
  })
}
_renderItem=({ item })=>{
  return(
    <View style={{
      flex:1,
      backgroundColor:item.backgroundColor,
      alignItems:'center',
      justifyContent:'center',
      paddingBottom:100
      }}>
      <Text style={styles.title} >{item.title}</Text>
      <Image style={styles.image} resizeMode='center' source={item.image}/>
      {/* <Text style={styles.text}>{item.text}</Text> */}
    </View>
  )
}
_onDone=()=>{
  AsyncStorage.setItem('value','true').then(()=>{
    this.setState({intro:true})
  })
}
_onSkip=()=>{
  AsyncStorage.setItem('value','true').then(()=>{
    this.setState({intro:true})
  })
}
  render() {
    if(this.state.loading){
      return (
        <View>
          <Image source={require('./assets/images/splash.png')} style={{width: width, height:height}}>
          </Image>
        </View>
      )
    } if (this.state.intro){
      return (
        <View style={styles.container}>
          <Provider store={Initial}>
           <AppNavigator />
          </Provider>
        </View>
      )
    } else {
      return(
        <AppIntroSlider dotStyle={{backgroundColor:'rgba(255,255,255,0.5)'}}
        slides={slides}
        renderItem={this._renderItem}
        onDone={this._onDone}
        showSkipButton={true}
        onSkip={this._onSkip}
        />
      )
    }
  }
}
let slides =[
  {
    key: 's1',
    //text: 'Best Recharge offers',
    title: 'Manage your Expenses with Paylist',
    image: require('./assets/images/intro1.png'),
    backgroundColor: '#8CAD81',
  },
  {
    key: 's2',
    title: 'Simply add any of your Expenses for you to Track',
   //text: 'Upto 25% off on Domestic Flights',
    image: require('./assets/images/intro2.png'),
    backgroundColor: '#ccbc58',
  },
  {
    key: 's3',
    title: 'Use Paylist Now',
    //text: 'Enjoy Great offers on our all services',
    image: require('./assets/images/intro3.png'),
    backgroundColor: '#2e2d2d',
  },
]

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  image:{
    width:width/2,
    height:height/2
  },
  text:{
    fontSize:18,
    color:'grey',
    textAlign:'center',
    paddingVertical:30,
  },
  title:{
    fontSize:25,
    color:'white',
    textAlign:'center',
    marginBottom:16,
    fontWeight:"700"
  }
})
