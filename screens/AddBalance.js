import React, { Component } from 'react'
import { 
    StyleSheet,
    View,
    ScrollView, TouchableOpacity, BackHandler
} from 'react-native'
import {IconButton } from 'react-native-paper'
import deviceStorage from '../service/deviceStorage'
import Config from '../config'
import { inject, observer } from 'mobx-react'

const t = require('tcomb-form-native')
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
const Form = t.form.Form
const User = t.struct ({
    balance: t.Number,
})

const option = {
  stylesheet:stylesheet,
    fields: {
        balance: {
            autoCapitalize: 'none',
            autoCorrect: false,
            keyboardType: 'number-pad',
            maxLength:10
        },
    }
}
@inject('store') @observer
export default class AddBalance extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: {
                loading:false,
                balance: '',
            }
        }
        this._AddBalance = this._AddBalance.bind(this)
        this.onBackButtonPressed = this.onBackButtonPressed.bind(this)
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
          }}
            onPress={() => params.handleCreate()}>
            <IconButton
              icon='check' size={25}/>
          </TouchableOpacity>
      } 
    }
componentDidMount(){
  BackHandler.addEventListener('hardwareBackPress',this.onBackButtonPressed)
}
componentWillUnmount(){
  BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed)
}
onBackButtonPressed() {
  this.props.navigation.navigate('Main')
  return true
}
    componentWillMount() {
      this.props.navigation.setParams({ handleCreate: this._AddBalance })
    }
  
    _onChange = (value) => {
    this.setState({ value })
    }

    async _AddBalance(){
    let DEMO_TOKEN = await deviceStorage.loadJWT("token")
    const value = this.refs.form.getValue()
    // If the form is valid...
    if (value) {
      const data = {
        balance: value.balance,
      }
      let payload = []
      for (let property in data) {
        let encodedKey = encodeURIComponent(property)
        let encodedValue = encodeURIComponent(data[property])
        payload.push(encodedKey + "=" + encodedValue)
      }
      payload = payload.join("&")
      const header= {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept : 'application/x-www-form-urlencoded',
        'Authorization': DEMO_TOKEN
      }
      //sent post request
      fetch(`${Config.PaylistApiURL}/addsaldo`, {
        method: 'POST',
        headers: header,
        body: payload
      })
      .then(res => {
        switch (res.status) {
          case 200:
            alert('Success Add Balance')
            this.props.navigation.navigate('Main')
            break
          case 400:
            alert('field can\'t be negative or zero')
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
      <View style={styles.container}>
        <ScrollView > 
         <Form ref='form'
                options={option}
                type={User}
                value={this.state.value}
                onChange={this._onChange}
          />          
        </ScrollView> 
      </View>
    )
  }
}

let styles = StyleSheet.create({
    container: {
      padding: 20,
      flex: 1,
      alignItems:'flex-start',
      flexDirection: 'row',
    }
})