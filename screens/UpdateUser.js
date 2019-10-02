import React, { Component } from 'react'
import { 
    StyleSheet,
    View,
    ScrollView,
    Text,
} from 'react-native';
import deviceStorage from '../service/deviceStorage';
import { Button } from 'react-native-paper';

const t = require('tcomb-form-native');
const Form = t.form.Form
const User = t.struct ({
    email: t.String,
    name: t.String,
    username: t.String,
    password: t.String,
    balance: t.String,
})

const option = {
    fields: {
        email: {
            autoCapitalize: 'none',
            autoCorrect: false,
        },
        name: {
            autoCapitalize: 'none',
            autoCorrect: false,
        },
        username: {
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
            data:[],
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
        this._UpdateUser = this._UpdateUser.bind(this);
    }

    componentWillUnmount() {
        this.setState = {
            value: {
                email:'',
                name: '',
                username:'',
                password:'',
                balance: '',
                error:'',
                loading:true
            }
        }
    }

    _onChange = (value) => {
      this.setState({
          value
      })
  }

    async _UpdateUser(id){
    var DEMO_TOKEN = await deviceStorage.loadJWT("token");
    console.log(DEMO_TOKEN)
    const value = this.refs.form.getValue();
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
      };
      //sent post request
      fetch('http://192.168.100.17:8000/v1/paylist/user' + id, {
        method: 'PUT',
        headers: header,
        body: payload
      })
      .then((res) => {
        resStatus = res.status
        return res.json()
      })
      .then(resJson => {
        switch (resStatus) {
          case 200:
          let list = JSON.stringify(resJson.data)
          let json = JSON.parse(list)
            this.setState({
              loading: false,
              data: json,
            });
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

// componentDidMount(){
//   this.setState = {
//     value: {
//         email:'',
//         name: '',
//         username:'',
//         password:'',
//         balance: '',
//         error:'',
//         loading:true
//     }
// }
// }
    
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
            <Button style={styles.button} mode="contained" onPress={this._UpdateUser}>
              <Text style={[styles.button, styles.greenButton]}>Update</Text>
            </Button>
          </View>  
      </View>
    );
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
});
