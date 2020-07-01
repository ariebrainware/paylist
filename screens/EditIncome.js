import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity, BackHandler, View, Modal,TextInput
} from 'react-native'
import deviceStorage from '../service/deviceStorage'
import Config from '../config'
import { IconButton, ActivityIndicator } from 'react-native-paper'
import { inject, observer } from 'mobx-react'

@inject('store') @observer
export default class UpdatePaylist extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        income: '',
    }
    this._UpdateIncome = this._UpdateIncome.bind(this)
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
              icon='check' size={28} color='#8CAD81' activeOpacity={0.5}/>
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
  UNSAFE_componentWillMount() {
    let { navigation } = this.props
    this.props.navigation.setParams({ handleUpdate: this._UpdateIncome })
    {
      this.setState({
          income: JSON.parse(navigation.getParam('income', '')),
        })
    }
  }

  _onChange = (value) => {
    this.setState({ value })
  }

  async _UpdateIncome(id) {
    let DEMO_TOKEN = await deviceStorage.loadJWT("token")
       // If the form is valid...
      let data = {
        income: this.state.income,
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
      fetch(`${Config.PaylistApiURL}/income/` + id, {
        method: 'PUT',
        headers: header,
        body: payload
      })
        .then(res => {
          switch (res.status) {
            case 200:
              this.props.store.setLoading()
              setTimeout(() => {
                alert('Success Edit Income')
                this.props.navigation.navigate('Main')
                this.props.store.getLoading()
              }, 1500)
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
    }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
        <TextInput
            value={String(this.state.income)}
            style={styles.textInput}
            placeholder="income"
            keyboardType='numeric'
            onChangeText={(text)=> this.setState({income:text})}
        />
          <View>
            {this.props.store.loading && <View>
            <ActivityIndicator size='small' color='white' style={{marginTop:7}}/>
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
    backgroundColor:'#2e2d2d',
    flex:1,
    flexDirection: 'column',
  },
  date:{
    paddingTop:10,
    marginHorizontal: 14,
    width: '96%',
  },
  textInput:{
    backgroundColor:'transparent', 
    color:'white', 
    borderBottomWidth:0.5, 
    borderBottomColor:'#8CAD81'
  }
})
