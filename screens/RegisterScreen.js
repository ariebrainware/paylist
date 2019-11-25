import React, { Component } from 'react'
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,View, Text, KeyboardAvoidingView, Modal
} from 'react-native'
import Config from '../config'
import { inject, observer } from 'mobx-react'
import { ActivityIndicator,IconButton} from 'react-native-paper'
import stylesheet from '../style/formStyle'

let t = require('tcomb-form-native')
let Form = t.form.Form

let newUser = t.struct({
  name: t.String,
  email: t.String,
  username: t.String,
  password: t.String,
  ConfirmPassword: t.String
})

let option = {
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
@inject('store') @observer
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
    let params = navigation.state.params
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
           <IconButton
              icon='check' size={28} color='#319e4c' activeOpacity={0.5}/>
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
    let value = this.refs.form.getValue()
    //IF the form valid ..
    if (value) {
      let data = {
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
              this.props.store.setLoading()
              setTimeout(()=>{
                alert('You may login now')
                this.props.store.getLoading()
                this.props.navigation.navigate('Login')
              },2000)
              break
            case 500:
              alert('username exist')
              this.props.store.getLoading()
              break
            default:
              alert('Something wrong, please try again later!')
              this.props.store.getLoading()
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
        <View>
          {this.props.store.loading && <View>
            <ActivityIndicator size='small' color='black'/>
          </View>}
        </View>
      </ScrollView>
      <Modal transparent={true} animationType="fade" visible={this.props.store.loading}>
      <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center', backgroundColor:'rgba(0,0,0,0.1)'}}>
        </View>
      </Modal>
      </KeyboardAvoidingView>
    )
  }
}

let styles = StyleSheet.create({
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
