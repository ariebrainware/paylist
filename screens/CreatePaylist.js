import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity, BackHandler
} from 'react-native'
import {IconButton} from 'react-native-paper'
import deviceStorage from '../service/deviceStorage'
import Config from '../config'
import {observer, inject} from 'mobx-react'


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
const createPaylist = t.struct({
  name: t.String,
  amount: t.String,
})

const option = {
  stylesheet:stylesheet,
  fields: {
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
export default class CreatePaylist extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: {
        name: '',
        amount: '',
        error: '',
      }
    }
    this._CreatePaylist = this._CreatePaylist.bind(this)
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
    this.props.navigation.setParams({ handleCreate: this._CreatePaylist })
  }

  _onChange = (value) => {
    this.setState({
      value
    })
  }

  async _CreatePaylist() {
    let DEMO_TOKEN = await deviceStorage.loadJWT("token")
    const value = this.refs.form.getValue()
    // If the form is valid...
    if (value) {
      const data = {
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
      const header = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/x-www-form-urlencoded',
        'Authorization': DEMO_TOKEN
      }
      //sent post request
      fetch(`${Config.PaylistApiURL}/paylist`, {
        method: 'POST',
        headers: header,
        body: payload
      })
        .then(res => {
          switch (res.status) {
            case 200:
              alert('Success save paylist')
              setTimeout(()=>{
              this.props.navigation.navigate('Main')
              },2000)
              break
            case 403:
              alert('You have to login first.')
              this.props.navigation.navigate('Login')
              break
            case 500:
              alert('Token expired')
              this.props.navigation.navigate('Login')
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
      alert('Please fill the empty field')
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Form
          ref='form'
          options={option}
          type={createPaylist}
          value={this.state.value}
          onChange={this._onChange}
        />
      </ScrollView>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    flexDirection: 'column',
  },
})
