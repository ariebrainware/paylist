import React from 'react'
import {View, Text,StyleSheet, RefreshControl} from 'react-native'
import deviceStorage  from '../service/deviceStorage'
import { Card, Button, Title, Paragraph, Appbar} from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import Config from '../config'
import Initial from '../State.js'
import {observer} from 'mobx-react'

@observer
export default class SettingsScreen extends React.Component {
  constructor(props){
    super(props)
    this.state ={
      data: [],
      Loading:true
    }
    this._handleLogOut = this._handleLogOut.bind(this)
    this._GetDataUser = this._GetDataUser.bind(this) 
  }

async _handleLogOut(){
    var DEMO_TOKEN = await deviceStorage.deleteJWT('token')
    const header = {
      'Authorization' : DEMO_TOKEN
    }
    fetch(`${Config.PaylistApiURL}/paylist/users/signout`, {
      method: 'GET',
      headers: header
    })
      .then(res => {
        Initial.getState()
        switch (res.status) {
        case 200:
          this.props.navigation.navigate('Login')
          alert('You have been logged out.')
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
  _onMore = () => console.log('Shown more');
  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params
      return {
        headerRight: 
        <Appbar.Action style={{backgroundColor:'#fff',
          width: 50,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          right: 5,
          bottom: 3}} icon="more-vertical" onPress={this._onMore}></Appbar.Action>
      };
  }
componentDidMount(){
    this._GetDataUser()
    Initial.getState()
  }

async _GetDataUser(){
    var DEMO_TOKEN = await deviceStorage.loadJWT('token')
    const header= {
      'Authorization': DEMO_TOKEN
    }
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
          })
          break
        case 500:
          alert('token expired')
          this.props.navigation.navigate('Login')
          break
        case 401:
          alert('Unauthorized')
          setTimeout(()=> {
          this.props.navigation.navigate('Login');}, 2000)
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
    })
    this._GetDataUser()
  }

render(){
    let user= this.state.data.map((val) => {
      return (<Card key={val.ID} style={styles.container} >
        <Card >
          <Card.Content style={{flex:1,borderWidth:0, width:250, height:80,backgroundColor:'#9d9e9e', alignItems:'center', justifyContent:'center', left:85}}>
            <Title>{val.name}</Title>
            <Paragraph>{val.email}</Paragraph>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content style={{paddingTop:10}}>
            <Paragraph>Your Balance                                                                 Rp: {val.balance} </Paragraph>
          </Card.Content>
          <Card>
            <Card.Actions>
              <Button onPress={() =>  this.props.navigation.navigate('UpdateUser',{
                name: JSON.stringify(this.state.data),
                loading: Initial.getState()
              })}>Edit Data </Button>
            </Card.Actions>
          </Card>
        </Card>
      </Card>
      )
    })
  return(
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
    )
  }
} 

SettingsScreen.navigationOptions = {
  title: 'My Account',
  headerStyle:{
    backgroundColor:'#a9b0ae'
  }
}
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
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
