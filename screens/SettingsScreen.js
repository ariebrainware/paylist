import React from 'react';
import {Image, View, Text,StyleSheet, TouchableHighlight, RefreshControl} from 'react-native';
import deviceStorage  from '../service/deviceStorage';
import { Card, Button, Title, Paragraph, DataTable } from 'react-native-paper';
import { AppLoading } from 'expo';
import { ScrollView } from 'react-native-gesture-handler';
import Config from '../config';

export default class SettingsScreen extends React.Component {
  constructor(props){
    super(props)
    this.state ={
      data: [],
      Loading:true
  };
    this._handleLogOut = this._handleLogOut.bind(this);
    this._GetDataUser = this._GetDataUser.bind(this);   
  }
 async _handleLogOut(){
    var DEMO_TOKEN = await deviceStorage.deleteJWT("token");
    console.log(" demo "+ DEMO_TOKEN)
    const header = {
      'Authorization' : DEMO_TOKEN
    }
    fetch(`${Config.PaylistApiURL}/paylist/users/signout`, {
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
         case 500:
           alert('token expired')
           this.props.navigation.navigate('Login')
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

  componentDidMount(){
    this._GetDataUser();
  }

  async _GetDataUser(){
      var DEMO_TOKEN = await deviceStorage.loadJWT("token");
      console.log(DEMO_TOKEN)
      const header= {
          'Authorization': DEMO_TOKEN
      };
        fetch(`${Config.PaylistApiURL}/paylist/users`, {
            method: 'GET',
            headers: header
          })
          .then((res) => {
          resStatus = res.status
          return res.json()
          })
          .then(ress => {
              switch (resStatus) {
                  case 200:
                      let dataString = JSON.stringify(ress.data)
                      let dataParse = JSON.parse(dataString)
                      this.setState({
                          data: dataParse,
                          Loading:false
                      });
                  break    
              } 
        })
        .catch((error) => {
          console.log(error)
        })
      }
    
      onRefresh() {
        this.setState({
          data:[]
        });
        this._GetDataUser();
      }
  render(){
    console.log(this.state)
    let user= this.state.data.map((val) => {
    return (<Card key={val.ID} style={{margin: 0}}>
              <Card>
                <Card.Content style={{flex:1,borderWidth:0, width:250, height:80,backgroundColor:'#eee', alignItems:'center', justifyContent:'center', left:90}}>
                    <Title>{val.name}</Title>
                    <Paragraph>{val.email}</Paragraph>
                </Card.Content>
              </Card>
              <Card style={{}}>
                <Card.Content style={{paddingTop:10}}>
                  <Paragraph>Your Balance                                                                 Rp: {val.balance} </Paragraph>
                </Card.Content>
                <Card>
            <Card.Actions>
              <Button onPress={() =>  this.props.navigation.navigate('UpdateUser',{
                name: JSON.stringify(this.state.data)
              })}>Edit Data </Button>
              </Card.Actions>
          </Card>
              </Card>
           </Card>
    )
    });   
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            //refresh control used for the Pull to Refresh
            refreshing={this.state.Loading}
            onRefresh={this.onRefresh.bind(this)}
          />
        }>
       {user}
        </ScrollView>
        <View>
          <Card>
            <Card.Actions>
            <Button onPress={this._handleLogOut}>
             <Text style={styles.logoutButton}>Logout</Text>
            </Button>
            </Card.Actions>
          </Card>
        </View>
      </View>
    );
  }
} 


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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop:0,
  },
  logoutTextCont : {
    flex:1,
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