import React, { Component } from 'react'
import { 
    StyleSheet,
    View,
    ScrollView,
    Text,Image,TouchableOpacity 
} from 'react-native'
import deviceStorage from '../service/deviceStorage'
import { Button,} from 'react-native-paper'
import Config from '../config'

const t = require('tcomb-form-native')
const Form = t.form.Form
const User = t.struct ({
    balance: t.Number,
})

const option = {
    fields: {
        balance: {
            autoCapitalize: 'none',
            autoCorrect: false,
            keyboardType: 'phone-pad'
        },
    }
}

export default class AddBalance extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: {
                balance: '',
                error:'',
                loading: false
            }
        }
        this._AddBalance = this._AddBalance.bind(this)
    }
    componentWillUnmount() {
      this.setState = {
          value: {
              balance:'',
              error:'',
              loading:true
          }
      }
  }
    _onChange = (value) => {
    this.setState({ value })
    }

    async _AddBalance(){
    var DEMO_TOKEN = await deviceStorage.loadJWT("token")
    console.log(DEMO_TOKEN)
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
      // console.log(payload)
      payload = payload.join("&")
      console.log(`payload: ${payload}`)
      const header= {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept : 'application/x-www-form-urlencoded',
        'Authorization': DEMO_TOKEN
      }
      //sent post request
      fetch(`${Config.PaylistApiURL}/paylist/addsaldo`, {
        method: 'POST',
        headers: header,
        body: payload
      })
      .then(res => {
        console.log(res)
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
      <View>
        <ScrollView style={styles.container}> 
         <Form ref='form'
                options={option}
                type={User}
                value={this.state.value}
                onChange={this._onChange}
          />          
        </ScrollView> 
          <View> 
               <Button style={styles.button} mode="contained" onPress={this._AddBalance}>
                    <Text style={[styles.greenButton]}>Add</Text>
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
