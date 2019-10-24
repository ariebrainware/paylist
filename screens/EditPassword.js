import React, { Component } from 'react'
import {
    ScrollView,
    StyleSheet, 
    TouchableOpacity, Image} 
    from 'react-native'
import Config from '../config'
import deviceStorage from '../service/deviceStorage'

const t = require('tcomb-form-native')
const Form = t.form.Form

const Password = t.struct({
    OldPassword: t.String,
    NewPassword: t.String,
})

const option = {
    fields: {
        OldPassword: {
            autoCapitalize: 'none',
            password: true,
            autoCorrect: false,
            secureTextEntry: true,
        },
        NewPassword: {
            autoCapitalize: 'none',
            password: true,
            autoCorrect: false,
            secureTextEntry: true,
        }
    }
}

export default class EditPassword extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: {
                OldPassword: '',
                NewPassword: '',
                error: '',
                loading: false
            }
        }
        this._EditPassword = this._EditPassword.bind(this)
    }

static navigationOptions = ({navigation}) => {
        const params = navigation.state.params
        const data = navigation.getParam('id','')
        return {
          headerRight: <TouchableOpacity style={{
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              right: 5,
              bottom: 3}}
              onPress={() =>params.handleUpdate(data)}>
            <Image 
                source={
                  require ('../assets/images/ceklis.png')
                }
                style={{resizeMode: 'contain',
                width: 20,
                height: 20,}}
            />
            </TouchableOpacity> 
        }
      }
      
componentWillMount(){
    this.props.navigation.setParams({ handleUpdate: this._EditPassword})
}    
_onChange = (value) => {
    this.setState({
        value
    })
}

async _EditPassword(id) {
    var DEMO_TOKEN = await deviceStorage.loadJWT("token")
    const value = this.refs.form.getValue()
     //IF the form valid ..
    this.setState({ error: '', loading: true })
        if (value) {
            const data = {
                OldPassword: value.OldPassword,
                NewPassword: value.NewPassword,
            }
            let payload = []
            for (let property in data) {
                let encodedKey = encodeURIComponent(property)
                let encodedValue = encodeURIComponent(data[property])
                payload.push(encodedKey + "=" + encodedValue)
            }
        payload = payload.join("&")
        console.log(`payload: ${payload}`)
        //sent post request
        fetch(`${Config.PaylistApiURL}/paylist/editpassword/` +3, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept : 'application/x-www-form-urlencoded',
            'Authorization': DEMO_TOKEN
        },
            body: payload
        })
        .then(res => {
        resStatus = res.status
        return res.json()
        })
        .then(res => {
            switch (resStatus) {
            case 200:
                alert('Success Update Password')
                this.props.navigation.navigate('SettingsStack')
                break
            case 404:
                alert('Old password doesn\'t match')
                break
            default:
                alert('Something wrong, please try again later!')
                break
            }
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
            <Form ref='form' 
                type={Password} options={option}
                value={this.state.value} 
                onChange={this._onChange}/>
        </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        flexDirection: 'column',
    },
})