import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,View, BackHandler, Modal,TextInput
} from 'react-native'
import {IconButton,  ActivityIndicator} from 'react-native-paper'
import deviceStorage from '../service/deviceStorage'
import Config from '../config'
import {observer, inject} from 'mobx-react'
import DatePicker from 'react-native-datepicker'

@inject('store') @observer
export default class CreatePaylist extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      amount: '',
      due_date: '',
    }
    this._CreatePaylist = this._CreatePaylist.bind(this)
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
              icon='check' size={28} color='#8CAD81'/>
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
    this.props.navigation.setParams({ handleCreate: this._CreatePaylist })
  }

  setDate(newDate){
      this.setState({ due_date: newDate})
  }

  _onChange = (value) => {
    this.setState({
      value
    })
  }

  async _CreatePaylist() {
    let DEMO_TOKEN = await deviceStorage.loadJWT("token")
    // If the form is valid...
    if (this.state.name && this.state.amount === ""){
      alert("field name and amount can't be null")
      return
    }
    if (this.state.name === ""){
      alert("name can't be null")
      return
    }
    if (this.state.amount === "" || this.state.amount === 0){
      alert("amount can't be null or zero")
      return
    }
    let data = {
      name : this.state.name,
      amount: this.state.amount,
      due_date: this.state.due_date,
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
      fetch(`${Config.PaylistApiURL}/paylist`, {
        method: 'POST',
        headers: header,
        body: payload
      })
        .then(res => {
          switch (res.status) {
            case 200:
              this.props.store.setLoading()
              setTimeout(()=>{
              alert('Success save paylist')
              this.props.navigation.navigate('Main')
              this.props.store.getLoading()
              },2000)
              break
            case 403:
              alert('You have to login first.')
              this.props.navigation.navigate('Login')
              this.props.store.getLoading()
              break
            case 500:
              alert('Token expired')
              this.props.navigation.navigate('Login')
              this.props.store.getLoading()
              break
            default:
              alert('Something wrong, please try again later!')
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
    let dt = new Date()
    let date = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate()
    return (
      <View style={styles.container}>
      <ScrollView >
        <TextInput style={styles.textInput} placeholder="Name" placeholderTextColor='white' onChangeText={(text)=> this.setState({name:text})} />
        <TextInput style={styles.textInput} placeholder="Amount" placeholderTextColor='white' keyboardType="numeric" onChangeText={(text)=> this.setState({amount:text})}/>
        <DatePicker
        style={styles.date} customStyles={{dateText:{color:'white'}}}
        date={this.state.due_date}
        mode="date"
        format="YYYY-MM-DD"
        placeholder="Due Date (Optional)"
        minDate={date}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        onDateChange={(newDate)=>this.setState({due_date:newDate})}
      />
        <View>
          {this.props.store.loading && <View>
            <ActivityIndicator size='small' color='white' style={{marginTop:7}} />
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
    flex: 1,
    flexDirection: 'column',
    backgroundColor:'#2e2d2d'
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
