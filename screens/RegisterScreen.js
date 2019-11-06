import React, { Component } from 'react'
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity, Image,View, Text, KeyboardAvoidingView
} from 'react-native'
import Config from '../config'

const t = require('tcomb-form-native')
const Form = t.form.Form
let _ = require('lodash')

const stylesheet = _.cloneDeep(t.form.Form.stylesheet)

stylesheet.textbox.normal.borderWidth = 0
stylesheet.textbox.error.borderWidth = 0
stylesheet.textbox.normal.marginBottom = 0
stylesheet.textbox.error.marginBottom = 0

stylesheet.textboxView.normal.borderWidth = 0
stylesheet.textboxView.error.borderWidth = 0
stylesheet.textboxView.normal.borderRadius = 0
stylesheet.textboxView.error.borderRadius = 0
stylesheet.textboxView.normal.borderBottomWidth = 0.5
stylesheet.textboxView.error.borderBottomWidth = 0.5
stylesheet.textboxView.normal.marginBottom = 5
stylesheet.textboxView.error.marginBottom = 5

const newUser = t.struct({
  name: t.String,
  email: t.String,
  username: t.String,
  password: t.String,
  ConfirmPassword: t.String
})

const option = {
  stylesheet:stylesheet,
  fields: {
    name: {
      autoCapitalize: 'none',
      autoCorrect: false,
    },
    email: {
      autoCapitalize: 'none',
      autoCorrect: false,
      keyboardType:'email-address'
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
    },
    ConfirmPassword: {
      autoCapitalize: 'none',
      password: true,
      autoCorrect: false,
      secureTextEntry: true,
    }
  }
}

export default class RegisterScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: {
        name: '',
        email: '',
        username: '',
        password: '',
        ConfirmPassword:''
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
    }
  }

  componentWillMount() {
    this.props.navigation.setParams({ handleSignUp: this._handleAdd })
  }

  _onChange = (value) => {
    this.setState({
      value
    })
  }

  _handleAdd = () => {
    const value = this.refs.form.getValue()
    //IF the form valid ..
    if (value) {
      const data = {
        name: value.name,
        email: value.email,
        username: value.username,
        password: value.password,
        ConfirmPassword: value.ConfirmPassword
      }
      let payload = []
      for (let property in data) {
        let encodedKey = encodeURIComponent(property)
        let encodedValue = encodeURIComponent(data[property])
        payload.push(encodedKey + "=" + encodedValue)
      }
      payload = payload.join("&")
      //sent post request
      if (data.ConfirmPassword !== data.password){
        alert("password doesn't match")
      } else {
      fetch(`${Config.PaylistApiURL}/user/signup`, {
        //IF the form valid ..
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
      }
    } else {
      //form validation error
      alert('Please fill the empty field')
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container}
      keyboardVerticalOffset={100} behavior={"padding"}>
      <ScrollView >
        <Form ref='form'
          type={newUser} options={option}
          value={this.state.value}
          onChange={this._onChange} />
        <View style={styles.signupTextCont}>
          <Text style={styles.signupText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
            <Text style={styles.signupButton}> Login</Text>
          </TouchableOpacity>
        </View> 
      </ScrollView></KeyboardAvoidingView>
     
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',
  },
  signupTextCont: {
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 3,
    flexDirection: 'row',
  },
  signupText: {
    color: 'black',
    fontSize: 16,
  },
  signupButton: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
})
