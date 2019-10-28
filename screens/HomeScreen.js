import React from 'react'
import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  View
} from 'react-native'
import Config from '../config'
import deviceStorage from '../service/deviceStorage'
import { createFilter } from 'react-native-search-filter'
import { List, Card, Checkbox, Button, ActivityIndicator, Searchbar, Provider, Portal, FAB } from 'react-native-paper'
import Initial from '../State.js'
import { observer, inject } from 'mobx-react'
import { when } from 'mobx'

const KEYS_TO_FILTERS = ['CreatedAt', 'name', 'amount'];

@inject('store') @observer
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

  user = new this._GetData()

  componentDidMount() {
    this._GetData()
    when(() => this.props.store.loadingHome == false, () => {
      console.info('Loading is true!')
      this._GetData()
      this.props.navigation.dispatch('Main')
      console.log("lh", Initial.loadingHome)
    })
  }

  onRefresh() {
    Initial.paylist
    this._GetData()
  }
  async _GetData() {
    var DEMO_TOKEN = await deviceStorage.loadJWT('token')
    const header = {
      'Authorization': DEMO_TOKEN
    }
    fetch(`${Config.PaylistApiURL}/paylist/paylist`, {
      method: 'GET',
      headers: header
    })
      .then((res) => {
        resStatus = res.status
        return res.json()
      })
      .then(resJson => {
        switch (resStatus) {
          case 200:
            let list = JSON.stringify(resJson.data)
            let json = JSON.parse(list)
            Initial.paylist = json
            break
          case 500:
            alert('Token Expired')
            setTimeout(() => {
              this.props.navigation.navigate('Login');
            }, 2000)
            break
          case 401:
            alert('Unauthorized')
            setTimeout(() => {
              this.props.navigation.navigate('Login');
            }, 2000)
            break
        }
      })
  }

  searchUpdated(term) {
    this.setState({ Search: term })
  }

  async _DeletePaylist(id) {
    var DEMO_TOKEN = await deviceStorage.loadJWT('token')
    const header = {
      'Authorization': DEMO_TOKEN
    }
    fetch(`${Config.PaylistApiURL}/paylist/paylist/` + id, {
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
            alert('Delete Paylist Success')
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

  async _UpdatePaylistStatus(id) {
    var DEMO_TOKEN = await deviceStorage.loadJWT('token')
    const header = {
      'Authorization': DEMO_TOKEN
    }
    fetch(`${Config.PaylistApiURL}/paylist/status/` + id, {
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
      })
  }

  render() {
    console.log("loading ", this.props.store.loadingHome)
    if (this.props.store.loadingHome) {
      return (
        <View style={{ padding: 20 }}>
          <ActivityIndicator />
        </View>
      )
    }
    const filteredPaylist = Initial.paylist.filter(createFilter(this.state.Search, KEYS_TO_FILTERS))
    let { checked } = this.state
    let pay = filteredPaylist.map((item) => {
      var tgl = new Date(item.CreatedAt)
      if (item.completed == true) {
        checked = true
      } else {
        checked = false
      }
      return <Card key={item.ID} style={styles.Item}>
        <Card style={styles.content}>
          <List.Accordion
            title={item.name}
            left={props => <List.Icon {...props} icon="monetization-on" />}>
            <List.Item titleStyle={{ color: 'black' }} style={{ right: 50 }} title={item.amount} />
            <List.Item titleStyle={{ color: 'black' }} style={{ right: 50 }} title={JSON.stringify(item.completed)} />
            <List.Item style={{ right: 50 }} title={tgl.toDateString()} />
            <Card.Actions style={{ right: 50 }}>
              <Button color='red' onPress={() => this._DeletePaylist(item.ID)} icon="delete">delete</Button>
              <Button color='black' icon="edit" onPress={() => this.props.navigation.navigate('UpdatePaylist', {
                id: item.ID,
                name: JSON.stringify(item.name),
                amount: JSON.stringify(item.amount)
              })}>edit</Button>
              <Checkbox status={checked ? 'checked' : 'unchecked'}
                onPress={() => this._UpdatePaylistStatus(item.ID)} />
            </Card.Actions>
          </List.Accordion>
        </Card>
      </Card>
    })

    return (
      <Provider>
        <View style={styles.container}>
          <Searchbar
            style={{ padding: 0, margin: 4 }}
            placeholder="Search"
            onChangeText={(term) => { this.searchUpdated(term) }}
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
            <FAB.Group
              open={this.state.open}
              icon={this.state.open ? 'today' : 'add'}
              actions={[
                { icon: 'create', label: 'Balance', onPress: () => this.props.navigation.navigate('AddBalance') },
                { icon: 'playlist-add', label: 'Paylist', onPress: () => this.props.navigation.navigate('CreatePaylist') },
              ]}
              onStateChange={({ open }) => this.setState({ open })}
              onPress={() => {
                if (this.state.open) {
                  // do something if the speed dial is open
                }
              }}
            />
          </Portal>
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  contentContainer: {
    paddingTop: 10,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
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
