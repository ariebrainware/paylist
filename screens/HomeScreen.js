import * as WebBrowser from 'expo-web-browser'
import React from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  View
} from 'react-native'
import Config from '../config'
import { MonoText } from '../components/StyledText'
import deviceStorage from '../service/deviceStorage'
import SearchInput, { createFilter } from 'react-native-search-filter'
import { List, Card, Checkbox, Button, ActivityIndicator, Searchbar,Provider, Portal, FAB} from 'react-native-paper'


const KEYS_TO_FILTERS = ['CreatedAt','name', 'amount'];
export default class HomeScreen extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      paylist :[],
      Search: '',
      loading: true,
      open:false,
      checked: false
    }
    this._DeletePaylist = this._DeletePaylist.bind(this)
    this._GetData = this._GetData.bind(this)
  }

  componentDidMount(){
    this._GetData()
  }
  async _GetData(){
    var DEMO_TOKEN = await deviceStorage.loadJWT('token')
    console.log(DEMO_TOKEN)
    const header= {
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
          this.setState({
            loading:false,
            paylist: json
          })
          break
        }      
      })
      .catch((error) => {
        console.log(error)
      })
  }

  searchUpdated(term) {
    this.setState({ Search: term })
  }

  async _DeletePaylist(id){
    var DEMO_TOKEN = await deviceStorage.loadJWT('token')
    console.log(' demo '+ DEMO_TOKEN)
    const header = {
      'Authorization' : DEMO_TOKEN
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
        console.log(res)
        switch (resStatus) {
        case 200:
          console.log('success')
          alert('Delete Success.')
          break
        case 404:
          console.log('no paylist found')
          alert('no paylist found')
          break
        case 400:
          console.log('specify paylist id')
          alert('specify paylist id')
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

  componentWillMount() {
  }

  async _UpdatePaylistStatus(id){
    var DEMO_TOKEN = await deviceStorage.loadJWT('token')
    console.log(' demo '+ DEMO_TOKEN)
    const header = {
      'Authorization' : DEMO_TOKEN
    }
    fetch(`${Config.PaylistApiURL}/paylist/status/`+id, {
      method: 'PUT',
      headers: header
    })
      .then(res => {
        resStatus = res.status
        return res.json()
      })
      .then(res => {
        console.log(res.data)
        this.setState({ 
          checked: true
        })
      })
  }
    
  onRefresh() {
    this.setState({
      paylist:[]
    })
    this._GetData()
  }

  render(){
    if (this.state.loading) {
      return(
        <View style={{padding:20}}>
          <ActivityIndicator/>
        </View>
      )
    }
    const filteredPaylist = this.state.paylist.filter(createFilter(this.state.Search, KEYS_TO_FILTERS))
    const { checked } = this.state
    console.log(this.state)
    let pay = filteredPaylist.map((item) => {
    var tgl = new Date(item.CreatedAt)
      return <Card key={item.ID} style={styles.Item}>
        <Card style={styles.content}>
        <List.Accordion
          title={item.name}
          left={props => <List.Icon {...props} icon="monetization-on" />}>
          <List.Item style={{right: 50}} title={item.amount}/>
          {/* <List.Item style={{right: 50}} title={JSON.stringify(item.completed)}/> */}
          <List.Item style={{right: 50}} title={tgl.toDateString()}/>
          <Card.Actions style={{right:50}}>
            <Button onPress={ () => this._DeletePaylist(item.ID)} icon="delete">delete</Button>
            <Button icon="edit" onPress={() =>  this.props.navigation.navigate('UpdatePaylist',{
              id : item.ID,
              name: JSON.stringify(item.name),
              amount: JSON.stringify(item.amount)
            })}>edit</Button>
            <Checkbox status={checked ? 'checked' : 'unchecked' } onPress={ () => this._UpdatePaylistStatus(item.ID)}/>
          </Card.Actions>
        </List.Accordion>
        </Card>
      </Card>    
    })
   
    return (
      <Provider>
      <View style={styles.container}>
        <Searchbar
        style={{padding:0, margin:4}}
        placeholder="Search"
        onChangeText={(term) => { this.searchUpdated(term)}}       
        />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}  refreshControl={
            <RefreshControl
            //refresh control used for the Pull to Refresh
              refreshing={this.state.loading}
              onRefresh={this.onRefresh.bind(this)}
            />
          }>{pay}        
          </ScrollView>
         <Portal>
          <FAB.Group
            open={this.state.open}
            icon={this.state.open ? 'today' : 'add'}
            actions={[
              { icon: 'create', label: 'Saldo',onPress: () =>  this.props.navigation.navigate('AddBalance') },
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
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:  '#78f0df',
  },
  contentContainer: {
    paddingTop:0,
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
  Item: {
    margin:1.5,
    padding:3.5
  },
  content: {
    backgroundColor: '#fff',
    margin: 0.5,
  },
})
