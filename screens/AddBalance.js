import React, { Component } from 'react'
import { 
    StyleSheet,
    View,
    ScrollView, TouchableOpacity, BackHandler, Modal
} from 'react-native'
import {IconButton, ActivityIndicator} from 'react-native-paper'
import deviceStorage from '../service/deviceStorage'
import Config from '../config'
import { inject, observer } from 'mobx-react'
import stylesheet from '../style/formStyle'

let t = require('tcomb-form-native')
let Form = t.form.Form
let User = t.struct ({
    balance: t.Number,
})

let option = {
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
      let params = navigation.state.params
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
              icon='check' size={28} color='#319e4c' activeOpacity={0.5}/>
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
    let value = this.refs.form.getValue()
    // If the form is valid...
    if (value) {
      let data = {
        balance: value.balance,
      }
      let payload = []
      for (let property in data) {
        let encodedKey = encodeURIComponent(property)
        let encodedValue = encodeURIComponent(data[property])
        payload.push(encodedKey + "=" + encodedValue)
      }
      payload = payload.join("&")
      let header= {
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
            this.props.store.setLoading()
            setTimeout(()=>{
              alert('Success Add Balance')
              this.props.navigation.navigate('Main')
              this.props.store.getLoading()
            },2000)
            break
          case 400:
            alert('field can\'t be negative or zero')
            this.props.store.getLoading()
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
        <ScrollView> 
         <Form ref='form'
                options={option}
                type={User}
                value={this.state.value}
                onChange={this._onChange}
          />
          <View>
          {this.props.store.loading && <View>
            <ActivityIndicator size='small' color='black'/>
          </View>}
        </View>
        </ScrollView>
        <Modal transparent={true} visible={this.props.store.loading} animationType="fade">
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center', backgroundColor:'rgba(0,0,0,0.1)'}}>
        </View>
        </Modal> 
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