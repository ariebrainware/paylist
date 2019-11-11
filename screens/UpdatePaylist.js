import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity, BackHandler
} from 'react-native'
import deviceStorage from '../service/deviceStorage'
import Config from '../config'
import { IconButton } from 'react-native-paper'
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
const paylist = t.struct({
  name: t.String,
  amount: t.Number,
})

const option = {
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
    const params = navigation.state.params
    const data = JSON.parse(navigation.getParam('id', ''))
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
    const { navigation } = this.props
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
      fetch(`${Config.PaylistApiURL}/paylist/` + id, {
        method: 'PUT',
        headers: header,
        body: payload
      })
        .then(res => {
          switch (res.status) {
            case 200:
              alert('Success Update paylist')
              this.props.navigation.navigate('Main')
              break
            case 500:
              alert('token expired')
              this.props.navigation.navigate('Login')
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
        <ScrollView  style={styles.container}>
          <Form ref='form'
            options={option}
            type={paylist}
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
    flex:1,
    flexDirection: 'column',
    backgroundColor:'#eee'
  },
})
