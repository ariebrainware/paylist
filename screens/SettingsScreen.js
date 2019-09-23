import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { View, Button} from 'react-native';
import { deviceStorage } from '../service/deviceStorage';

var STORAGE_KEY = 'token';
export default class SettingsScreen extends React.Component {

  _handleLogOut(){
    fetch('http://192.168.100.8:8000/v1/paylist/users/signout', {
        method: 'GET',
        headers: {
          'Authorization' : STORAGE_KEY
        }
      })
      .then(res => {
       resStatus = res.status
       return res.json()
     })
     .then(res => {
       switch (resStatus) {
         case 200:
            deviceStorage.deleteJWT(STORAGE_KEY, res.token);
           console.log('success')
           console.log(STORAGE_KEY)
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
