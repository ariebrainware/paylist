import React from 'react'
import { StyleSheet, View, TouchableOpacity, Image} from 'react-native'
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
  rol()
}
async _handleLogOut(){
    var DEMO_TOKEN = await deviceStorage.deleteJWT('token')
    const header = {
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
        <Card.Title
        title='Settings'
         left={(props) => <Avatar.Icon{...props} style={{width:40, height:40,backgroundColor:'#fff'}} size={50} icon="settings"/>}>
        </Card.Title>
        </Card>
        <Card style={{margin:2, width:500, right:20}}>
            <Drawer.Item
              icon='lock'
              label="Change Password"
              onPress={() => this.props.navigation.navigate('EditPassword')}/>
        </Card>
        <Card style={{margin:2, width:500, right:20}}>
          <Drawer.Item
            icon='arrow-forward'
            label="Logout"
            onPress={this._handleLogOut}/>
        </Card>
    </View>
    )
  }
}
    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent:'flex-end',
    backgroundColor: '#fefefe',
    paddingTop:hp(2.7),
    paddingHorizontal: 20
  },
  Drawer:{
    margin:2, 
    width:wp(100),
    height:60, 
    right:22,
    backgroundColor:'#a9b0ae'
  }
})
