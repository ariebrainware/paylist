import React from 'react'
import { StyleSheet, View} from 'react-native'
import { Drawer, Card, Avatar, IconButton } from 'react-native-paper'
import deviceStorage from '../service/deviceStorage'
import Config from '../config'
import {observer, inject} from 'mobx-react'

@inject('store') @observer
export default class DrawerScreen extends React.Component {
  constructor(){
    super()
    this._handleLogOut = this._handleLogOut.bind(this) 
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
      <Card style={{margin:2, width:500,height:60, right:22,backgroundColor:'#a9b0ae'}}>
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
        paddingTop:18,
        paddingHorizontal: 20
      },
    })
