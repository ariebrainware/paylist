import React from 'react'
import { DrawerActions} from 'react-navigation-drawer'
import {View, Text,StyleSheet, RefreshControl,ScrollView} from 'react-native'
import deviceStorage  from '../service/deviceStorage'
import { Card, Button, Title, Paragraph,Appbar, ActivityIndicator} from 'react-native-paper'
import Config from '../config'
import Initial from '../State.js'
import {observer, inject} from 'mobx-react'

@inject('store') @observer
export default class SettingsScreen extends React.Component {
  constructor(props){
    super(props)
    this._GetDataUser = this._GetDataUser.bind(this) 
  }

  _onMore =() =>{
      //Props to open/close the drawer
      this.props.navigation.dispatch(DrawerActions.openDrawer())
  }
static navigationOptions = ({navigation}) => {
    const params = navigation.state.params
      return {
        title: 'My Account',
        headerStyle:{
          backgroundColor:'#a9b0ae'
        },
        headerRight: (
          <Appbar.Action
            icon="menu"
            onPress={() => params.showMore()}
          ></Appbar.Action>      
        )
      };
  }

componentWillMount(){
    this.props.navigation.setParams({ showMore: this._onMore.bind(this)})
}

componentDidMount(){
    this._GetDataUser()
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
          Initial.data = dataParse
          this.props.store.getLoadingSetting()
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
    Initial.data
    this._GetDataUser()
  }

render(){
  if (this.props.store.loadingSetting) {
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator />
      </View>
    )
  }
    let user= Initial.data.map((val) => {
      return (<Card key={val.ID} style={styles.container} >
        <Card >
          <Card.Content style={{flex:1,borderWidth:0, width:250, height:80,backgroundColor:'#9d9e9e', alignItems:'center', justifyContent:'center', left:85}}>
            <Title>{val.name}</Title>
            <Paragraph>{val.email}</Paragraph>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content style={{flex:1, alignItems:'flex-start', flexDirection:'row' ,paddingTop:10}}>
            <Paragraph style={{fontWeight:'bold'}}>Your Balance</Paragraph>
            <Paragraph style={{left:240}}> Rp: {val.balance}</Paragraph>
          </Card.Content>
          <Card>
            <Card.Actions>
              <Button onPress={() =>  this.props.navigation.navigate('UpdateUser',{
                name: JSON.stringify(Initial.data),
                loading: this.props.store.getLoading()
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
              refreshing={this.props.store.loadingSetting}
              onRefresh={this.onRefresh.bind(this)}
            />
          }>
          {user}
        </ScrollView>
      </View>
    )
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
})
