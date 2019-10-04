import React, { Component } from 'react';
import { 
    StyleSheet,
    View,
    ScrollView,
    Text,
    TouchableHighlight
} from 'react-native';
import deviceStorage from '../service/deviceStorage';

const t = require('tcomb-form-native');
const Form = t.form.Form
const createPaylist = t.struct ({
    name: t.String,
    amount: t.String,
    completed: t.String
})

const option = {
    fields: {
        name: {
            autoCapitalize: 'none',
            autoCorrect: false,
        },
        amount: {
            autoCapitalize: 'none',
            autoCorrect: false,
        },
        completed: {
            autoCapitalize: 'none',
            autoCorrect: false,
        }
    }
}

export default class CreatePaylist extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            value: {
                name:'',
                amount: '',
                completed: '',
                error:'',
                loading: false
            }
        }
        this._CreatePaylist = this._CreatePaylist.bind(this);
    }

    componentWillUnmount() {
        this.setState = {
            value: {
                name: '',
                amount: '',
                completed:'',
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

    async _CreatePaylist(){
    var DEMO_TOKEN = await deviceStorage.loadJWT('token');
    const value = this.refs.form.getValue();
    // If the form is valid...
    if (value) {
      const data = {
        name: value.name,
        amount: value.amount,
        completed: value.completed
      }
      let payload = []
      for (let property in data) {
        let encodedKey = encodeURIComponent(property)
        let encodedValue = encodeURIComponent(data[property])
        payload.push(encodedKey + "=" + encodedValue)
      }
      payload = payload.join("&")
      console.log(`payload: ${payload}`)
      const header= {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept : 'application/x-www-form-urlencoded',
        'Authorization': DEMO_TOKEN
      };
      //sent post request
      fetch('http://192.168.100.14:8000/v1/paylist/paylist', {
        method: 'POST',
        headers: header,
        body: payload
       })
       .then(res => {
        resStatus = res.status
        return res.json()
      })
      .then(res => {
        switch (resStatus) {
          case 200:
            console.log('success')
            console.log('dari res' +res.data.jwt)
            break
          case 403:
            console.log('please sign in again')
            alert('You have to login first.')
            break
          case 500:
            console.log('token expired')
            alert('Please sign in again')
            break
          default:
            console.log('unhandled')
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
                  <View>
                    <TouchableHighlight onPress={this._CreatePaylist}>
                        <Text style={[styles.button, styles.greenButton]}>Create</Text>
                    </TouchableHighlight>
                  </View>
                </ScrollView>   
                );
      }
};

var styles = StyleSheet.create({
    container: {
      padding: 20,
      flex: 0,
      flexDirection: 'column',
      //backgroundColor:'red'
    },
    button: {
      borderRadius: 4,
      padding: 20,
      textAlign: 'center',
      marginBottom: 20,
      color: '#fff'
    },
    greenButton: {
      backgroundColor: '#4CD964'
    },
    centering: {
      alignItems: 'center',
      justifyContent: 'center'
    }
});
