import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity, BackHandler, View, Modal
} from 'react-native'
import deviceStorage from '../service/deviceStorage'
import Config from '../config'
import { IconButton, ActivityIndicator } from 'react-native-paper'
import { inject, observer } from 'mobx-react'
import stylesheet from '../style/formStyle'

let t = require('tcomb-form-native')
let Form = t.form.Form
let paylist = t.struct({
  name: t.String,
  amount: t.Number,
})

let option = {
  fields: {
    stylesheet:stylesheet,
    name: {
      autoCapitalize: 'none',
      autoCorrect: false,
    },
    amount: {
      autoCapitalize: 'none',
      autoCorrect: false,
      keyboardType: 'number-pad'
    },
  }
}
@inject('store') @observer
export default class UpdatePaylist extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: {
        name: '',
        amount: '',
        error: '',
      }
    }
    this._UpdatePaylist = this._UpdatePaylist.bind(this)
    this.onBackButtonPressed = this.onBackButtonPressed.bind(this)
  }
  static navigationOptions = ({ navigation }) => {
    let params = navigation.state.params
    let data = JSON.parse(navigation.getParam('id', ''))
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
          onPress={() => params.handleUpdate(data)}>
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
    let { navigation } = this.props
    this.props.navigation.setParams({ handleUpdate: this._UpdatePaylist })
    {
      this.setState({
        value: {
          name: JSON.parse(navigation.getParam('name', '')),
          amount: JSON.parse(navigation.getParam('amount', ''))
        }
      })
    }
  }

  _onChange = (value) => {
    this.setState({ value })
  }

  async _UpdatePaylist(id) {
    let DEMO_TOKEN = await deviceStorage.loadJWT("token")
    let value = this.refs.form.getValue()
    // If the form is valid...
    if (value) {
      let data = {
        name: value.name,
        amount: value.amount,
      }
      let payload = []
      for (let property in data) {
        let encodedKey = encodeURIComponent(property)
        let encodedValue = encodeURIComponent(data[property])
        payload.push(encodedKey + "=" + encodedValue)
      }
      payload = payload.join("&")
      let header = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/x-www-form-urlencoded',
        'Authorization': DEMO_TOKEN
      }
      //sent post request
      fetch(`${Config.PaylistApiURL}/paylist/` + id, {
        method: 'PUT',
        headers: header,
        body: payload
      })
        .then(res => {
          switch (res.status) {
            case 200:
              this.props.store.setLoading()
              setTimeout(()=>{
                alert('Success Update paylist')
                this.props.navigation.navigate('Main')
                this.props.store.getLoading()
              }, 2000)
              break
            case 500:
              alert('token expired')
              this.props.navigation.navigate('Login')
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
            type={paylist}
            value={this.state.value}
            onChange={this._onChange}
          />
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
        </View>
    )
  }
}



let styles = StyleSheet.create({
  container: {
    padding: 20,
    flex:1,
    flexDirection: 'column',
    backgroundColor:'#eee'
  },
})
