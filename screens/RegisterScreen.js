import React, { Component } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity, Image
}
  from 'react-native'
import { Button } from 'react-native-paper'
import Config from '../config'
const t = require('tcomb-form-native')
const Form = t.form.Form

const newUser = t.struct({
  name: t.String,
  email: t.String,
  username: t.String,
  password: t.String
})

const option = {
  fields: {
    name: {
      autoCapitalize: 'none',
      autoCorrect: false,
    },
    email: {
      autoCapitalize: 'none',
      autoCorrect: false,
    },
    username: {
      autoCapitalize: 'none',
      autoCorrect: false,
    },
    password: {
      autoCapitalize: 'none',
      password: true,
      autoCorrect: false,
      secureTextEntry: true,
    }
  }
}

class RegisterScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: {
        name: '',
        email: '',
        username: '',
        password: '',
        error: '',
        loading: false
      }
    }
    this._handleAdd = this._handleAdd.bind(this)
    this.onRegistrationFail = this.onRegistrationFail.bind(this)
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
          onPress={() => params.handleSignUp()}>
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
    this.props.navigation.setParams({ handleSignUp: this._handleAdd })
  }

  componentWillUnmount() {
    this.setState = {
      value: {
        name: '',
        email: '',
        username: '',
        password: null,
      }
    }
  }

  _onChange = (value) => {
    this.setState({
      value
    })
  }

  _handleAdd = () => {
    const value = this.refs.form.getValue()
    //IF the form valid ..
    this.setState({ error: '', loading: true })
    if (value) {
      const data = {
        name: value.name,
        email: value.email,
        username: value.username,
        password: value.password,
      }
      let payload = []
      for (let property in data) {
        let encodedKey = encodeURIComponent(property)
        let encodedValue = encodeURIComponent(data[property])
        payload.push(encodedKey + "=" + encodedValue)
      }
      payload = payload.join("&")
      console.log(`payload: ${payload}`)
      //sent post request
      fetch(`${Config.PaylistApiURL}/paylist/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/x-www-form-urlencoded'
        },
        body: payload
      })
        .then(res => {
          resStatus = res.status
          return res.json()
        })
        .then(res => {
          switch (resStatus) {
            case 200:
              alert('You may login now')
              this.props.navigation.navigate('Login')
              break
            case 500:
              alert('username exist')
              break
            default:
              alert('Something wrong, please try again later!')
              break
          }
        })
        .done()
    } else {
      //form validation error
      alert('Please fill the empty field')
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Form ref='form'
          type={newUser} options={option}
          value={this.state.value}
          onChange={this._onChange} />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',
  },
  button: {
    borderRadius: 4,
    padding: 3,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#4CD964'
  },
})

export default RegisterScreen