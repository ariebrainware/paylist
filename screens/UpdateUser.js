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
    email: t.String,
    name: t.String,
    username: t.String,
    password: t.String,
    balance: t.Number,
})

const option = {
    fields: {
        username: {
          autoCapitalize: 'none',
          autoCorrect: false,
          editable: false
        },
        email: {
            autoCapitalize: 'none',
            autoCorrect: false,
        },
        name: {
            autoCapitalize: 'none',
            autoCorrect: false,
        },
        password: {
            autoCapitalize: 'none',
            autoCorrect: false,
            secureTextEntry: true,
            password: true,
        },
        balance: {
            autoCapitalize: 'none',
            autoCorrect: false,
            keyboardType: 'phone-pad'
        },
    }
}

export default class UpdateUser extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: {
                email:'',
                name:'',
                username:'',
                password:'',
                balance: '',
                error:'',
                loading: false
            }
        }
        this._UpdateUser = this._UpdateUser.bind(this)
    }

    componentWillMount() {
      const { navigation } = this.props
      const data = JSON.parse(navigation.getParam('name',[]))
      {
        data.map((item)=> {
          return (
            this.setState({
              value : {
                email : item.email,
                name: item.name,
                username: item.username,
                password: item.password,
                balance: item.balance
              }
            })
          )
        })
      }
    }
    
    _onChange = (value) => {
    this.setState({ value })
    }

    async _UpdateUser(id){
    var DEMO_TOKEN = await deviceStorage.loadJWT("token")
    console.log(DEMO_TOKEN)
    const value = this.refs.form.getValue()
    // If the form is valid...
    if (value) {
      const data = {
        email: value.email,
        name: value.name,
        username: value.username,
        password: value.password,
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
      fetch(`${Config.PaylistApiURL}/paylist/user/`+ id, {
        method: 'PUT',
        headers: header,
        body: payload
      })
      .then(res => {
        console.log(res)
        switch (res.status) {
          case 200:
            alert('Success save paylist')
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
  const { navigation } = this.props
  const data = JSON.parse(navigation.getParam('name',[]))
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
          {
             data.map((item)=> {
               return <View key={item.ID}>
               <Button style={styles.button} mode="contained" onPress={ () => this._UpdateUser(item.ID)}>
                      <Text style={[styles.button, styles.greenButton]}>Update</Text>
                      </Button>
                      </View>
             })
      }
            
          </View>  
      </View>
    )
  }
}

UpdateUser.navigationOptions = {
  headerRight :(
    <TouchableOpacity
      style={{position: 'absolute',
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      right: 5,
      bottom: 3}}
        onPress={this._UpdateUser}>
      <Image 
      source={
        require ('../assets/images/ceklis.png')
      }
        style={{resizeMode: 'contain',
        width: 20,
        height: 20,}}
        />
      </TouchableOpacity>
  )
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
