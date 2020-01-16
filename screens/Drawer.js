import React from 'react'
import { StyleSheet, View, Dimensions, Platform} from 'react-native'
import { Drawer, Card, Avatar, } from 'react-native-paper'
import deviceStorage from '../service/deviceStorage'
import Config from '../config'
import {observer, inject} from 'mobx-react'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen'

let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
@inject('store') @observer
export default class DrawerScreen extends React.Component {
  constructor(){
    super()
    this._handleLogOut = this._handleLogOut.bind(this) 
  }

  static navigationOptions = ({ navigation }) => {
    return {
        title: 'My Account',
        headerStyle: {
          backgroundColor: '#a9b0ae'
        },
    }
  }
componentDidMount(){
  loc(this)
}
componentWillUnmount(){
  rol(this)
}
async _handleLogOut(){
    let DEMO_TOKEN = await deviceStorage.deleteJWT('token')
    let header = {
      'Authorization' : DEMO_TOKEN
    }
    fetch(`${Config.PaylistApiURL}/users/signout`, {
      method: 'GET',
      headers: header
    })
      .then(res => {
        switch (res.status) {
        case 200:
          this.props.navigation.navigate('Login')
          alert('You have been logged out.')
          this.props.store.getLoading()
          break
        default:
          alert('Something wrong, please try again later!')
          break
        }
      })
      .catch(err => {
        console.error(err)
      })
      .done()
  }

render() {
  return (
    <View style={styles.container}>
      <Card style={styles.Drawer}>
        <Card.Title style={{alignContent:'center'}} titleStyle={{color:'#ccbc58'}}
         title='Settings' 
         left={(props) => <Avatar.Icon{...props} style={{width:40, height:40,backgroundColor:'#2e2d2d'}} size={50} icon="settings" color='#ccbc58' />}>
        </Card.Title>
        </Card>
          <Drawer.Item style={styles.item}
              icon='lock'
              label="Change Password"
              onPress={() => this.props.navigation.navigate('EditPassword')}/>     
          <Drawer.Item style={styles.item}
            icon='info'
            label="About"
            onPress={() => this.props.navigation.navigate('About')}/>
          <Drawer.Item style={styles.item}
            icon='arrow-forward'
            label="Logout"
            onPress={this._handleLogOut}/>
    </View>
    )
  }
}
    
let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e2d2d',
    paddingHorizontal: 20,
  },
  Drawer:{
    justifyContent:'center',
    width:width,
    height:55,
    right:20,
    backgroundColor:'#2e2d2d',
    elevation: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: "#70706e",
    marginBottom:5
  },
  card:{
    margin:2, 
    width:wp('70.7%'), 
    right:20,
    backgroundColor:'#2e2d2d',
  },
  item:{
    backgroundColor:'#ccbc58',
    width:width/1.67, 
    right:25
  }
})
