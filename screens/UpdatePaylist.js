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
const paylist = t.struct({
  name: t.String,
  amount: t.Number,
})

const option = {
  fields: {
    name: {
      autoCapitalize: 'none',
      autoCorrect: false,
    },
    amount: {
      autoCapitalize: 'none',
      autoCorrect: false,
      keyboardType: 'phone-pad'
    },
  }
}

export default class UpdatePaylist extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: {
        name: '',
        amount: '',
        error: '',
      }
    }
    this._UpdatePaylist = this._UpdatePaylist.bind(this)
  }
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params
    const data = JSON.parse(navigation.getParam('id', ''))
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
          onPress={() => params.handleUpdate(data)}>
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
    }
  }
  componentWillMount() {
    const { navigation } = this.props
    this.props.navigation.setParams({ handleUpdate: this._UpdatePaylist })
    {
      this.setState({
        value: {
          name: JSON.parse(navigation.getParam('name', '')),
          amount: JSON.parse(navigation.getParam('amount', ''))
        }
      })
    }
  }

  _onChange = (value) => {
    this.setState({ value })
  }

  async _UpdatePaylist(id) {
    var DEMO_TOKEN = await deviceStorage.loadJWT("token")
    const value = this.refs.form.getValue()
    // If the form is valid...
    if (value) {
      const data = {
        name: value.name,
        amount: value.amount,
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
      fetch(`${Config.PaylistApiURL}/paylist/` + id, {
        method: 'PUT',
        headers: header,
        body: payload
      })
        .then(res => {
          switch (res.status) {
            case 200:
              alert('Success Update paylist')
              this.props.navigation.navigate('Main')
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
            type={paylist}
            value={this.state.value}
            onChange={this._onChange}
          />
        </ScrollView>
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
