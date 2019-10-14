import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
} from 'react-native'
import deviceStorage from '../service/deviceStorage'
import { Button, } from 'react-native-paper'
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
        loading: false
      }
    }
    this._UpdatePaylist = this._UpdatePaylist.bind(this)
  }

  componentWillMount() {
    const { navigation } = this.props
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
      fetch(`${Config.PaylistApiURL}/paylist/paylist/` + id, {
        method: 'PUT',
        headers: header,
        body: payload
      })
        .then(res => {
          switch (res.status) {
            case 200:
              alert('Success save paylist')
              this.props.navigation.navigate('Main')
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
    const { navigation } = this.props
    const data = JSON.parse(navigation.getParam('id', ''))
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
        <View>
          <Button style={styles.button} mode="contained" onPress={() => this._UpdatePaylist(data)}>
            <Text style={[styles.button, styles.greenButton]}>Update</Text>
          </Button>
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
  button: {
    borderRadius: 4,
    padding: 3,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#4CD964'
  },
  greenButton: {
    backgroundColor: '#4CD964'
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center'
  }
})
