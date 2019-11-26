import React from 'react'
import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  View, BackHandler, Alert
} from 'react-native'
import Config from '../config'
import deviceStorage from '../service/deviceStorage'
import { createFilter } from 'react-native-search-filter'
import { List, Card, Checkbox, Button, ActivityIndicator, Searchbar, Provider, Portal, FAB, Text } from 'react-native-paper'
import { observer, inject } from 'mobx-react'

let KEYS_TO_FILTERS = ['CreatedAt', 'name']
@inject('store')
@observer
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Search: '',
      open: false,
      checked: false
    }
    this._DeletePaylist = this._DeletePaylist.bind(this)
    this._GetData = this._GetData.bind(this)
  }

  componentDidMount() {
    let { navigation } = this.props
    this.focusListener = navigation.addListener('didFocus', () => {
      setTimeout(()=>{
        this._GetData()
      },2000) 
    })
  }
  currencyFormat(num) {
    return 'Rp ' + parseInt(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed)
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed)
    this.focusListener.remove()
  }

  onBackButtonPressed() {
    BackHandler.exitApp()
    return true
  }
  onRefresh() {
    this.props.store.paylist
    this.props.store.setLoadingHome()
    setTimeout(()=>{
      this._GetData()
    }, 1000)
  }

  async _GetData() {
    let DEMO_TOKEN = await deviceStorage.loadJWT('token')
    let header = {
      'Authorization': DEMO_TOKEN
    }
    fetch(`${Config.PaylistApiURL}/paylist`, {
      method: 'GET',
      headers: header
    })
      .then((res) => {
        this.props.store.getLoading()
        resStatus = res.status
        return res.json()
      })
      .then(resJson => {
        switch (resStatus) {
          case 200:
            let list = JSON.stringify(resJson.data)
            let json = JSON.parse(list)
            this.props.store.paylist = json
            this.props.store.getLoadingHome()
            break
          case 500:
            alert('Token Expired')
            setTimeout(() => {
              this.props.navigation.navigate('Login')
            }, 2000)
            break
          case 401:
            alert('Unauthorized')
            setTimeout(() => {
              this.props.navigation.navigate('Login')
            }, 2000)
            break
        }
      })
  }

  searchUpdated(term) {
    this.setState({ Search: term })
  }

  async _DeletePaylist(id) {
    let DEMO_TOKEN = await deviceStorage.loadJWT('token')
    let header = {
      'Authorization': DEMO_TOKEN
    }
    fetch(`${Config.PaylistApiURL}/paylist/` + id, {
      method: 'DELETE',
      headers: header
    })
      .then(res => {
        resStatus = res.status
        return res.json()
      })
      .then(res => {
        switch (resStatus) {
          case 200:
            setTimeout(()=>{
              alert('Delete Paylist Success')
              this._GetData()
            },1000) 
            break
          case 404:
            alert('No Paylist Found')
            break
          case 400:
            alert('Specify Paylist ID')
            break
          case 500:
            alert('Token Expired')
            this.props.navigation.navigate('Login')
            break
          default:
            alert('Something wrong, please try again later!')
            break
        }
      })
      .done()
  }

  Confirm(item) {
    Alert.alert(
      'Confirm',
      'Do you want to delete this paylist?',
      [
        { text: 'Delete', onPress: () => this._DeletePaylist(item) },
        { text: 'Cancel', style: 'cancel' }
      ],
      { cancelable: true }
    )
  }

  async _UpdatePaylistStatus(id) {
    let DEMO_TOKEN = await deviceStorage.loadJWT('token')
    let header = {
      'Authorization': DEMO_TOKEN
    }
    fetch(`${Config.PaylistApiURL}/status/` + id, {
      method: 'PUT',
      headers: header
    })
      .then(res => {
        resStatus = res.status
        return res.json()
      })
      .then(res => {
        this.setState({
          checked: this.state[id]
        })
        switch (resStatus) {
          case 200:
            this._GetData()
            break
          case 404:
            alert('No Paylist Found')
            break
          case 400:
            alert('Specify Paylist ID')
            break
          case 500:
            alert('Token Expired')
            this.props.navigation.navigate('Login')
            break
          default:
            alert('Something wrong, please try again later!')
            break
        }
      })
      .done()
  }

  render() {
    if (this.props.store.loadingHome) {
      return (
        <View style={{ padding: 20 }}>
          <ActivityIndicator />
        </View>
      )
    }
    let filteredPaylist =this.props.store.paylist.filter(createFilter(this.state.Search, KEYS_TO_FILTERS))
    let { checked } = this.state
    let pay = filteredPaylist.map((item) => {
      let tgl = new Date(item.CreatedAt)
      if (item.completed == true) {
        checked = true
      } else {
        checked = false
      }
      return <Card key={item.ID} style={styles.Item}>
       
          <List.Accordion titleStyle={{color:'black'}}
            title={item.name}
            left={props => <List.Icon {...props} icon="monetization-on"/>}>
            <List.Item titleStyle={{ color: 'black' }} style={{ right: 50 }} title={this.currencyFormat(item.amount)} />
            <List.Item style={{ right: 50 }} title={tgl.toDateString()} />
            <Card.Actions style={{ right: 50 }}>
              <Button color='red' onPress={this.Confirm.bind(this, item.ID)} icon="delete">Delete</Button>
              <Button color='black' icon="edit" onPress={() => this.props.navigation.navigate('UpdatePaylist', {
                id: item.ID,
                name: JSON.stringify(item.name),
                amount: JSON.stringify(item.amount)
              })}>edit</Button>
              <Checkbox status={checked ? 'checked' : 'unchecked'} color='#54c470' uncheckedColor='#54c470'
                onPress={() => this._UpdatePaylistStatus(item.ID)} />
            </Card.Actions>
          </List.Accordion>
       
      </Card>
    })

    return (
      <Provider>
        <View style={styles.container}>
          <Searchbar
            style={{ padding: 0, margin: 3}}
            placeholder="search"
            onChangeText={(term) => {this.searchUpdated(term) }}
          />
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer} refreshControl={
              <RefreshControl
                //refresh control used for the Pull to Refresh
                refreshing={this.props.store.loadingHome}
                onRefresh={this.onRefresh.bind(this)}
              />
            }>{pay}
          </ScrollView>
          <Portal>
            <FAB.Group fabStyle={{backgroundColor:'#54c470'}}
              open={this.state.open}
              icon={this.state.open ? 'close' : 'add'}
              actions={[
                {style:{backgroundColor:'#F9E48A'},color:'black', icon: 'create', label: 'Balance', onPress: () => this.props.navigation.navigate('AddBalance') },
                {style:{backgroundColor:'#F9E48A'},color:'black', icon: 'playlist-add', label: 'Paylist', onPress: () => this.props.navigation.navigate('CreatePaylist') },
              ]}
              onStateChange={({ open }) => this.setState({ open })}
              onPress={() => {
                if (this.state.open) {
                  // do something if the speed dial is open
                }
              }}
            />
          </Portal>
          <View>
            <Card>
              <Card.Content style={{backgroundColor:'#eee', borderTopWidth:0.5,}}>
              <Text style={{fontWeight:'bold', fontSize:15}}>
                Total:  
              {this.currencyFormat(this.props.store.paylist.reduce((sum, i) => 
               (total = sum + i.amount), 0))}
              </Text>
              </Card.Content>
            </Card>
          </View>
        </View>
      </Provider>
    )
  }
}

HomeScreen.navigationOptions = {
  title: 'Home',
  headerStyle: {
    backgroundColor: '#a9b0ae'
  }
}
let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  contentContainer: {
    paddingTop: 10,
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
  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  },
  Item: {
    margin: 1.5,
    padding: 3.5,
  },
  content: {
    backgroundColor: '#ffff',
    margin: 0.5,
  }
})