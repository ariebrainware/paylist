import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Image, TouchableOpacity
} from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import deviceStorage from '../service/deviceStorage'
import Initial from '../State.js'
import { observer } from 'mobx-react'
import Config from '../config'

const t = require('tcomb-form-native')
const Form = t.form.Form
const User = t.struct({
  username: t.String,
  email: t.String,
  name: t.String,
  balance: t.Number,
})

const option = {
  fields: {
    username: {
      autoCapitalize: 'none',
      autoCorrect: false,
      editable: false
    },
    email: {
      autoCapitalize: 'none',
      autoCorrect: false,
    },
    name: {
      autoCapitalize: 'none',
      autoCorrect: false,
    },
    balance: {
      autoCapitalize: 'none',
      autoCorrect: false,
      keyboardType: 'phone-pad'
    },
  }
}

@observer
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
        loading: false
      }
    }
    this._UpdateUser = this._UpdateUser.bind(this)
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params
    const data = JSON.parse(navigation.getParam('name', []))
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
          <Image
            source={
              require('../assets/images/ceklis.png')
            }
            style={{
              resizeMode: 'contain',
              width: 20,
              height: 20,
            }}
          />
        </TouchableOpacity>
      })
    };
  }

  componentWillMount() {
    const { navigation } = this.props
    const data = JSON.parse(navigation.getParam('name', []))
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
    var DEMO_TOKEN = await deviceStorage.loadJWT("token")
    const value = this.refs.form.getValue()
    // If the form is valid...
    if (value) {
      const data = {
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
      const header = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/x-www-form-urlencoded',
        'Authorization': DEMO_TOKEN
      }
      //sent post request
      fetch(`${Config.PaylistApiURL}/paylist/user/` + id, {
        method: 'PUT',
        headers: header,
        body: payload
      })
        .then(res => {
          switch (res.status) {
            case 200:
              Initial.setState()
              alert('Success Edit Data')
              setTimeout(() => {
                this.props.navigation.navigate('SettingsStack')
              }, 2000)
              break
            case 500:
              alert('token expired')
              this.props.navigation.navigate('Login')
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
      <View>
        <ScrollView style={styles.container}>
          <Form ref='form'
            options={option}
            type={User}
            value={this.state.value}
            onChange={this._onChange}
          />
        </ScrollView>
        <View>
          {Initial.loading && <View>
            <ActivityIndicator size='small' />
          </View>}
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 0,
    flexDirection: 'column',
  },
})
