import React, { Component } from 'react';
import {Alert, Button, ScrollView, View, StyleSheet, Text, TouchableOpacity, TouchableHighlight } from 'react-native';
import Axios from 'axios';


const t = require('tcomb-form-native')

const Form = t.form.Form

const User = t.struct({
  username: t.String,
  password:  t.String
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
      autoCorrect: false
    }
  }
}

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            error:'',
            loading:false
        };
        this.loginUser = this.loginUser.bind(this);
        this.onLoginFail = this.onLoginFail.bind(this);
    }

    _onChange = (value) => {
      this.setState({
        value
      })
    }

  loginUser(){
    const value = this.refs.form.getValue();
    // If the form is valid...
    if (value) {
      const data = {
        username: value.email,
        password: value.password
      }
      const json = JSON.stringify(data)
      Axios.post("/user/signin", {
        body: json
       })
      .then((response) => response.json())
      .then((res) => {
        if (res.error){
          alert(res.error)
        } else {
          alert("success")
          this.props.navigation.navigate('Main')
        }
      })
      .catch((error) => {
        console.log(error);
        this.onLoginFail();
      })
      .done()
    } else {
        //form validation error
        alert('Please fix the errors listed and try again.')
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
    },
    signInText: {
      color:'green',
      fontSize:25,
      fontWeight: 'bold',
      padding: 0
  },
  })