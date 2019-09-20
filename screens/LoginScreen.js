import React, { Component } from 'react';
import { Alert, Button, ScrollView, View, StyleSheet, Text, TouchableOpacity, TouchableHighlight } from 'react-native';
import { TextInput } from 'react-native-paper';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      loading: false
    };
    this.loginUser = this.loginUser.bind(this)
  }

  loginUser() {
    let credentials = {
      'username': this.state.username,
      'password': this.state.password,
    }
    let payload = []
    for (let property in credentials) {
      let encodedKey = encodeURIComponent(property)
      let encodedValue = encodeURIComponent(credentials[property])
      payload.push(encodedKey + "=" + encodedValue)
    }
    payload = payload.join("&")
    console.log(`payload: ${payload}`)
    // Send a POST request
    fetch('http://192.168.100.19:3002/v1/paylist/user/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/x-www-form-urlencoded',

      },
      body: payload,
    })
      .then(response => response.json())
      .then(res => console.log(res))
      .catch((error) => {
        console.log(error);
        this.onLoginFail();
      })
      .done()
  }

  onLoginFail() {
    this.setState({
      error: 'Login Failed',
    });
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <TextInput
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })}
          placeholder={'Username'}
          style={styles.input}
        />
        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          placeholder={'Password'}
          style={styles.input}
          secureTextEntry={true}
        />
        <TouchableHighlight onPress={this.loginUser}>
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
    flex: 1,
    flexDirection: 'column'
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
  signInText: {
    color: 'green',
    fontSize: 25,
    fontWeight: 'bold',
    padding: 0
  }
})