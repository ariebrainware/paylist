import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet, 
    TouchableHighlight,
    Text,
    View } 
    from 'react-native';

const t = require('tcomb-form-native');
const Form = t.form.Form

const newUser = t.struct ({
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
            autoCorrect: false
        }
    }
}

class RegisterScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            value: {
                name:'',
                email: '',
                username:'',
                password:'',
                error:'',
                loading: false
            }
        }
        this._handleAdd = this._handleAdd.bind(this);
        this.onRegistrationFail = this.onRegistrationFail.bind(this);
    }

    componentWillUnmount() {
        this.setState = {
            value: {
                name: '',
                email: '',
                username:'',
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
        const value = this.refs.form.getValue();
        //IF the form valid ..
        this.setState({ error: '', loading: true });
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
    fetch('http://192.168.100.26:8000/v1/paylist/user/signup', {
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
        switch (resStatus) {
          case 200:
            console.log('success')
            alert('You may login now')
            break
        //   case 400:
        //     if (res.code === 'ValidationFailed') {
        //     // My custom error messages from the API.
        //         console.log('field can not be null')
        //         alert('field can not be null')
        //     }
        //     break
          case 500:
            console.log('username exist')
            alert('username exist')
            break
          default:
            console.log('unhandled')
            break
        }
      })
        .done()
        } else {
            //form validation error
            alert('Please fill the empty field')
        }
    }

    onRegistrationFail() {
        this.setState({
            error: 'Registration Failed',
            loading: false
        });
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Form ref='form' type={newUser} options={option}
                value={this.state.value} onChange={this._onChange}/>
                <TouchableHighlight onPress={this._handleAdd}>
                    <Text style={[styles.button, styles.greenButton]}>Create Account</Text>
                </TouchableHighlight>
            </ScrollView>
        )
    }
} 
  
const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:10,
        flexDirection: 'column',
        // backgroundColor:'red',
    },
    button: {
        borderRadius: 4,
        padding: 20,
        textAlign: 'center',
        marginBottom: 20,
        color: '#fff',
    },
    greenButton: {
        backgroundColor: '#4CD964',
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default RegisterScreen;