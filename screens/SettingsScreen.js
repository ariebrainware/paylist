import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { View, Button} from 'react-native';
import { deviceStorage } from '../service/deviceStorage';

export default class SettingsScreen extends React.Component {

 async _handleLogOut(){
    var DEMO_TOKEN = await deviceStorage.deleteJWT('token')
    console.log(DEMO_TOKEN)
    fetch('http://192.168.100.14:8000/v1/paylist/users/signout', {
        method: 'GET',
        headers: {
          'Authorization' : DEMO_TOKEN
        }
      })
      .then(res => {
       resStatus = res.status
       return res.json()
     })
     .then(res => {
       console.log(res.data)
       switch (resStatus) {
         case 200:
           console.log('success')
           this.props.navigation.navigate('Login')
           alert('You have been logged out.');
           break
        //  case 404:
        //    console.log('wrong username or password')
        //    alert('wrong username or password')
        //    break
        //  case 500:
        //    console.log('already login')
        //    alert('already login')
        //    break
         default:
           console.log('unhandled')
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
      <View style={{}}>
        <Button
         backgroundColor="#03A9F4"
         title="SIGN OUT"
         onPress={this._handleLogOut.bind(this)}
        />
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
};
