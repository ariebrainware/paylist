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
import DatePicker from 'react-native-datepicker'

@inject('store') @observer
export default class UpdatePaylist extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        name: '',
        amount: '',
        due_date:'',
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
    this.props.navigation.setParams({ handleUpdate: this._UpdatePaylist })
    {
      this.setState({
          name: JSON.parse(navigation.getParam('name', '')),
          amount: JSON.parse(navigation.getParam('amount', '')),
          due_date: JSON.parse(navigation.getParam('due_date', ''))
        })
    }
  }

  _onChange = (value) => {
    this.setState({ value })
  }

  setDate(newDate){
    this.setState({ due_date: newDate})
  }

  async _UpdatePaylist(id) {
    let DEMO_TOKEN = await deviceStorage.loadJWT("token")
   
    // If the form is valid...
    
      let data = {
        name: this.state.name,
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
  }

  render() {
    let dt = new Date()
    let date = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate()
    return (
      <View style={styles.container}>
        <ScrollView>
        <TextInput value={this.state.name} style={styles.textInput} placeholder="Name" onChangeText={(text)=> this.setState({name:text})} />
        <TextInput value={String(this.state.amount)} style={styles.textInput} maxLength={9}  placeholder="Amount" keyboardType="numeric" onChangeText={(text)=> this.setState({amount:text})}/>
        <DatePicker
          style={styles.date} customStyles={{dateText:{color:'white'}}}
          date={this.state.due_date}
          mode="date"
          format="YYYY-MM-DD"
          placeholder="Due Date"
          minDate={date}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          onDateChange={(newDate)=>this.setState({due_date:newDate})}
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
