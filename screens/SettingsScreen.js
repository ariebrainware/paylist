import React from 'react'
import { DrawerActions} from 'react-navigation-drawer'
import {View,StyleSheet, RefreshControl,ScrollView, Image, ImageBackground } from 'react-native'
import deviceStorage  from '../service/deviceStorage'
import { Card, Button, Title, Paragraph,Appbar, ActivityIndicator, TouchableRipple} from 'react-native-paper'
import Config from '../config'
import { observer, inject } from 'mobx-react'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen'


@inject('store') @observer
export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props)
    this._GetDataUser = this._GetDataUser.bind(this)
  }

  currencyFormat(num) {
    return 'Rp: ' + parseInt(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  _onMore = () => {
    //Props to open/close the drawer
    this.props.navigation.dispatch(DrawerActions.openDrawer())
  }
  static navigationOptions = ({ navigation }) => {
    let params = navigation.state.params
    return {
      title: 'My Account',
      headerStyle: {
        backgroundColor: '#a9b0ae'
      },
      headerRight: (
        <Appbar.Action
          icon="menu"
          onPress={() => params.showMore()}
        ></Appbar.Action>
      )
    }
  }
  componentWillMount() {
    this.props.navigation.setParams({ showMore: this._onMore.bind(this) })
  }

  componentDidMount() {
    let {navigation} = this.props
    this.focusListener = navigation.addListener('didFocus', () => {
      setTimeout(()=>{
        this._GetDataUser()
      },2000)
    })
    loc(this)
  }

  async _GetDataUser() {
    let DEMO_TOKEN = await deviceStorage.loadJWT('token')
    let header = {
      'Authorization': DEMO_TOKEN
    }
    fetch(`${Config.PaylistApiURL}/users`, {
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
            this.props.store.data = dataParse
            this.props.store.getLoadingSetting()
            break
          case 500:
            alert('token expired')
            this.props.navigation.navigate('Login')
            break
          case 401:
            alert('Unauthorized')
            setTimeout(() => {
              this.props.navigation.navigate('Login')
            }, 2000)
            break
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  componentWillUnMount() {
    rol()
    this.focusListener.remove()
  }
  onRefresh() {
    this.props.store.data
    this.props.store.setLoadingSetting()
    setTimeout(()=>{
      this._GetDataUser()
    }, 1000)
  }

  render() {
    if (this.props.store.loadingSetting) {
      return (
        <View style={{ padding: 20 }}>
          <ActivityIndicator />
        </View>
      )
    }
    let user = this.props.store.data.map((val) => {
      return (<Card key={val.ID} style={{backgroundColor:'#eee'}}>
        <Card></Card>
        <Card style={styles.username}>
          <Card.Content style={styles.content}>
            <Title>{val.name}</Title>
            <Paragraph>{val.email}</Paragraph>
          </Card.Content>
        </Card>
        <Card style={{margin:1, width:wp('98%'), alignSelf:'center'}} >
          <Card.Content style={styles.balance}>
            <Paragraph style={{fontWeight:'bold', fontSize: 15}}>Your Balance</Paragraph>
            <Paragraph style={{fontWeight:'bold'}}> {this.currencyFormat(val.balance)}</Paragraph>
          </Card.Content>
            <Card.Actions style={{borderBottomWidth:0.5, borderBottomColor:'grey'}}>
              <Button color='black' onPress={() => this.props.navigation.navigate('UpdateUser', {
                name: JSON.stringify(this.props.store.data),
                loading: this.props.store.getLoading()
              })} icon="mode-edit">Edit Data</Button>
            </Card.Actions>
        </Card>
      </Card>
      )
    })
    return (
      <View style={styles.container}>
        <ScrollView  contentContainerStyle={styles.contentContainer}
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

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  contentContainer: {
    paddingTop: 0,
  },
  username:{
    flex:2,
    alignSelf:'center',
    width: wp('55%'), 
    height: hp('11%'), 
    backgroundColor: '#ffff',
    borderRadius:5
  },
  content:{
    flex:4,
    alignItems:'center',
    justifyContent:'center',
  },
  balance:{
    flex:3,
    flexDirection:'row' ,
    paddingTop:10,
    justifyContent: 'space-between',
    borderBottomWidth:0.5,
    borderBottomColor:'grey',
    fontWeight: "400"
  },
})
