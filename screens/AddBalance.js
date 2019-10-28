import React, { Component } from 'react'
import { 
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity, Image
} from 'react-native'
import deviceStorage from '../service/deviceStorage'
import Config from '../config'

const t = require('tcomb-form-native')
const Form = t.form.Form
const User = t.struct({
  balance: t.Number,
})

const option = {
  fields: {
    balance: {
      autoCapitalize: 'none',
      autoCorrect: false,
      keyboardType: 'phone-pad'
    },
  }
}

export default class AddBalance extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: {
        balance: '',
        error: '',
        loading: false
      }
    }
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params
    return {
      headerRight:
        <TouchableOpacity style={{
          width: 50,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          right: 5,
          bottom: 3
        }}
          onPress={() => params.handleAdd()}>
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
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({ handleAdd: this._AddBalance })
  }
  _onChange = (value) => {
    this.setState({ value })
  }

  async _AddBalance() {
    var DEMO_TOKEN = await deviceStorage.loadJWT("token")
    const value = this.refs.form.getValue()
    // If the form is valid...
    if (value) {
      const data = {
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
      fetch(`${Config.PaylistApiURL}/paylist/addsaldo`, {
        method: 'POST',
        headers: header,
        body: payload
      })
        .then(res => {
          switch (res.status) {
            case 200:
              alert('Success Add Balance')
              this.props.navigation.navigate('Main')
              break
            case 400:
              alert('Field can\'t be negative or zero')
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
      </View >
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