import React, { Component } from 'react';
import {Alert, Button, ScrollView, View, StyleSheet, Text, TouchableOpacity, TouchableHighlight } from 'react-native';
import deviceStorage from '../service/deviceStorage';

const t = require('tcomb-form-native')

const Form = t.form.Form

const User = t.struct({
  username: t.String,
  password:  t.String
});

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

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          value: {
            username: '',
            password: '',
            error: '',
            loading: false
        }
      }
        this._handleLogin = this._handleLogin.bind(this);
        this.onLoginFail = this.onLoginFail.bind(this);
    }

    componentWillUnmount() {
      this.setState = {
        value: {
          username: '',
          password: null,
          error:'',
          loading:true

        }
      }
    }

    _onChange = (value) => {
      this.setState({
        value
      })
    }

  _handleLogin(){
    const value = this.refs.form.getValue();
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
      fetch('http://192.168.100.26:8000/v1/paylist/user/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept : 'application/x-www-form-urlencoded'
        },
        body: payload
       })
       .then(res => {
        resStatus = res.status
        return res.json()
      })
      .then(res => {
        console.log('saat login :' + res.data)
        switch (resStatus) {
          case 200:
            let token = {"type": "sensitive", "value":res.data}
            deviceStorage.saveKey("token", JSON.stringify(token));
            this.props.navigation.navigate('Main')
            break
          case 404:
            console.log('wrong username or password')
            alert('wrong username or password')
            break
          case 500:
            console.log('already login')
            alert('already login')
            this.props.navigation.navigate('Main')
            break
          default:
            console.log('unhandled')
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

  onLoginFail() {
    this.setState({
      error: 'Login Failed',
      loading: false
    });
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
            <TouchableHighlight onPress={this._handleLogin}>
              <Text style={[styles.button, styles.greenButton]}>Log In</Text>
            </TouchableHighlight>
        
                 <View style={styles.signupTextCont}>
                    <Text style={styles.signupText}>Don't have an account yet?</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                        <Text style={styles.signupButton}> Sign Up</Text>
                    </TouchableOpacity>
                 </View>
             </ScrollView>   
             );
        }
}

var styles = StyleSheet.create({
    container: {
      padding: 20,
      flex: 0,
      flexDirection: 'column',
      //backgroundColor:'red'
    },
    button: {
      borderRadius: 4,
      padding: 20,
      textAlign: 'center',
      marginBottom: 20,
      color: '#fff'
    },
    greenButton: {
      backgroundColor: '#4CD964'
    },
    centering: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    signupTextCont : {
        flex:0,
        alignItems:'flex-end',
        justifyContent :'center',
        paddingVertical:3,
        flexDirection:'row', 
    },
    signupText: {
        color:'black',
        fontSize:16,
    },
    signupButton: {
        color:'black',
        fontSize:16,
        fontWeight:'500',
    }
  })