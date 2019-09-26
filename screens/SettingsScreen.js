import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import {Button,Image, View, Text,StyleSheet, TouchableHighlight, TouchableOpacity} from 'react-native';
import deviceStorage  from '../service/deviceStorage';

export default class SettingsScreen extends React.Component {
  constructor(){
    super()
    this._handleLogOut = this._handleLogOut.bind(this);
  }
 async _handleLogOut(){
    var DEMO_TOKEN = await deviceStorage.deleteJWT("token");
    console.log(" demo "+ DEMO_TOKEN)
    const header = {
      'Authorization' : DEMO_TOKEN
    }
    fetch('http://192.168.100.26:8000/v1/paylist/users/signout', {
        method: 'GET',
        headers: header
      })
     .then(res => {
       switch (res.status) {
         case 200:
           console.log('success')
           this.props.navigation.navigate('Login')
           alert('You have been logged out.');
           break
         case 404:
           console.log('wrong username or password')
           alert('wrong username or password')
           break
         case 500:
           console.log('already login')
           alert('already login')
           break
         default:
           console.log('unhandled')
           alert('Something wrong, please try again later!')
           break
       }
     })
     .catch(err => {
       console.error(err)
     })
     .done()
    }
  
  render(){
    return (
      <View style={styles.logoutTextCont}>
        <TouchableOpacity onPress={this._handleLogOut}>
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
} 
  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
  // return <ExpoConfigView />;

SettingsScreen.navigationOptions = {
  title: 'Profile',
  // headerRight: (
  //   <TouchableOpacity
  //   style={{position: 'absolute',
  //   width: 50,
  //   height: 50,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   right: 10,
  //   bottom: 3}}
  //       //title="Logout"
  //       onPress={this._handleLogOut}>
  //     <Image 
  //     source={
  //       require ('../assets/images/logout.png')
  //     }
  //       style={{resizeMode: 'contain',
  //       width: 40,
  //       height: 40,}}
  //       />
  //     </TouchableOpacity>
  // )
};

var styles = StyleSheet.create({
  logoutTextCont : {
    flex:1,
    //alignItems:'flex-end',
    justifyContent :'space-between',
    paddingVertical:3,
    flexDirection:'column', 
  },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  LogoutText: {
    color:'black',
    fontSize:16,
},
  logoutButton: {
    color:'#4CD964',
    fontSize:20,
    fontWeight:'500',
},
  logoutStyle: {
  resizeMode: 'contain',
  width: 50,
  height: 50,
},
})