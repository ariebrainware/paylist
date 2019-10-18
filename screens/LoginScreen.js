import React, { Component } from 'react'
import {ScrollView, View, StyleSheet, Text, TouchableOpacity,} from 'react-native'
import deviceStorage from '../service/deviceStorage'
import { Button, ActivityIndicator } from 'react-native-paper'
import Config from '../config'
import Initial from '../State.js'
import {observer} from 'mobx-react'
import { AsyncStorage} from 'react-native'

const t = require('tcomb-form-native')
const Form = t.form.Form

const User = t.struct({
  username: t.String,
  password: t.String
})

const options = {
  fields: {
    username: {
      autoCapitalize: 'none',
      autoCorrect: false
    },
    password: {
      autoCapitalize: 'none',
      password: true,
      secureTextEntry: true,
      autoCorrect: false
    }
  }
}
@observer
export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: {
        username: '',
        password: '',
        error: '',
      },
      loading: false
    }
    this._handleLogin = this._handleLogin.bind(this)
  }

  componentWillUnmount() {
    this.setState = {
      value: {
        username: '',
        password: null,
        error: '',
      }
    }
  }

  componentDidMount(){
    this.loadInitialState().done();
  }

  async loadInitialState (){
   var token = await deviceStorage.loadJWT('token')
    if (token != null){
      this.props.navigation.navigate('Main')
    } else {
      this.props.navigation.navigate('Login')
    }
  }
  _onChange = (value) => {
    this.setState({
      value
    })
  }

  clearForm() {
    // clear content from all textbox
    this.setState({ value: null })
  }

  _handleLogin() {
    const value = this.refs.form.getValue()
    // If the form is valid...
    if (value) {
      const data = {
        username: value.username,
        password: value.password
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
      fetch(`${Config.PaylistApiURL}/paylist/user/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/x-www-form-urlencoded'
        },
        body: payload
       })
       .then(res => {
        Initial.setState()
        resStatus = res.status
        return res.json()
      })
      .then(res => {
        switch (resStatus) {
          case 200:
            let token = {"type": "sensitive", "value":res.data}
            deviceStorage.saveKey('token', JSON.stringify(token))
            setTimeout(()=>{
              this.props.navigation.navigate('Main')
             }, 2000)
            this.clearForm()
            alert('Login Success')
            break
          case 404:
            alert('wrong username or password')
            Initial.getState()
            this.clearForm()
            break
          case 202:
            Initial.getState()
            alert('already login')
            this.props.navigation.navigate('Main')
            this.clearForm()
            break
          default:
            alert('Something wrong, please try again later!')
            break
        }
      })
        .catch(err => {
          console.error(err)
        })
        .done()
    } else {
      //form validation error
      alert('please provide username or password')
    }
  }
  
  render() {
    return (
      <ScrollView style={styles.container}>
        <Form
          ref='form'
          options={options}
          type={User}
          value={this.state.value}
          onChange={this._onChange}
        />
        <Button style={styles.button} mode="contained" onPress={this._handleLogin}>LOGIN</Button>
        <View style={styles.signupTextCont}>
          <Text style={styles.signupText}>Don't have an account yet?</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
            <Text style={styles.signupButton}> Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View>
            {Initial.loading && <View>
              <ActivityIndicator size='small'/>
              </View>}
        </View>
      </ScrollView>
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
  },
  signupTextCont: {
    flex: 0,
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
