import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity, BackHandler, Modal
} from 'react-native'
import { ActivityIndicator, IconButton } from 'react-native-paper'
import deviceStorage from '../service/deviceStorage'
import { observer, inject } from 'mobx-react'
import Config from '../config'
import stylesheet from '../style/formStyle'

let t = require('tcomb-form-native')
let Form = t.form.Form
let User = t.struct({
  username: t.String,
  email: t.String,
  name: t.String,
  balance: t.Number,
})

let option = {
  stylesheet:stylesheet,
  fields: {
    username: {
      autoCapitalize: 'none',
      autoCorrect: false,
      editable:false
    },
    email: {
      autoCapitalize: 'none',
      autoCorrect: false,
      keyboardType:'email-address'
    },
    name: {
      autoCapitalize: 'none',
      autoCorrect: false,
    },
    balance: {
      autoCapitalize: 'none',
      autoCorrect: false,
      keyboardType: 'number-pad',
      maxLength:10,
    },
  }
}

@inject('store') @observer
export default class UpdateUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: {
        email: '',
        name: '',
        username: '',
        balance: '',
        error: '',
      }
    }
    this._UpdateUser = this._UpdateUser.bind(this)
    this.onBackButtonPressed = this.onBackButtonPressed.bind(this)
  }

  static navigationOptions = ({ navigation }) => {
    let params = navigation.state.params
    let data = JSON.parse(navigation.getParam('name', []))
    return {
      headerRight: data.map((val) => {
        return <TouchableOpacity key={val.ID} style={{
          width: 50,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          right: 5,
          bottom: 3
        }}
          onPress={() => params.handleUpdate(val.ID)}>
          <IconButton
              icon='check' size={28} color='#319e4c' activeOpacity={0.5}/>
        </TouchableOpacity>
      })
    }
  }
  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress',this.onBackButtonPressed)
  }
  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed)
  }
  onBackButtonPressed() {
    this.props.navigation.navigate('Main')
    return true
  }
  UNSAFE_componentWillMount() {
    let { navigation } = this.props
    let data = JSON.parse(navigation.getParam('name', []))
    this.props.navigation.setParams({ handleUpdate: this._UpdateUser })
    {
      data.map((item) => {
        return (
          this.setState({
            value: {
              email: item.email,
              name: item.name,
              username: item.username,
              balance: item.balance
            }
          })
        )
      })
    }
  }

  _onChange = (value) => {
    this.setState({ value })
  }

  async _UpdateUser(id) {
    let DEMO_TOKEN = await deviceStorage.loadJWT("token")
    let value = this.refs.form.getValue()
    // If the form is valid...
    if (value) {
      let data = {
        email: value.email,
        name: value.name,
        username: value.username,
        balance: value.balance,
      }
      let payload = []
      for (let property in data) {
        let encodedKey = encodeURIComponent(property)
        let encodedValue = encodeURIComponent(data[property])
        payload.push(encodedKey + "=" + encodedValue)
      }
      payload = payload.join("&")
      let header = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/x-www-form-urlencoded',
        'Authorization': DEMO_TOKEN
      }
      //sent post request
      fetch(`${Config.PaylistApiURL}/user/` + id, {
        method: 'PUT',
        headers: header,
        body: payload
      })
        .then(res => {
          switch (res.status) {
            case 200:
              this.props.store.loading = true
              setTimeout(() => {
                alert('Success Edit Data')
                this.props.navigation.navigate('SettingsStack')
                this.props.store.getLoading()
              }, 2000)
              break
            case 500:
              alert('token expired')
              this.props.navigation.navigate('Login')
              this.props.store.getLoading()
              break
          }
        })
        .catch(err => {
          console.error(err)
        })
        .done()
    } else {
      //form validation error
      alert('Please fill the empty field')
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Form ref='form'
            options={option}
            type={User}
            value={this.state.value}
            onChange={this._onChange}
          />
        <View style={{backgroundColor:'#eee', flex:2}}>
          {this.props.store.loading && <View>
            <ActivityIndicator size='small' color='black' style={{position:'relative'}} />
        </View>}
        </View>
      </ScrollView>
       <Modal transparent={true} animationType="fade" visible={this.props.store.loading}>
       <View style={{
           flex: 1,
           flexDirection: 'column',
           justifyContent: 'center',
           alignItems: 'center', backgroundColor:'rgba(0,0,0,0.1)'}}>
         </View>
       </Modal>
       </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    padding: 20,
    flex:1,
    flexDirection: 'column',
    backgroundColor:'#2e2d2d'
  },
})
