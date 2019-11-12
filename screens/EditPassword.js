import React, { Component } from 'react'
import {
    ScrollView,
    StyleSheet, View,
    TouchableOpacity, BackHandler
} from 'react-native'
import Config from '../config'
import deviceStorage from '../service/deviceStorage'
import Initial from '../State.js'
import {observer, inject} from 'mobx-react'
import {IconButton, ActivityIndicator} from 'react-native-paper'


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

const Password = t.struct({
    OldPassword: t.String,
    NewPassword: t.String,
    ConfirmPassword: t.String,
})

const option = {
    stylesheet:stylesheet,
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
        },
        ConfirmPassword: {
            autoCapitalize: 'none',
            password: true,
            autoCorrect: false,
            secureTextEntry: true,
        }
    }
}
@inject('store') @observer
export default class EditPassword extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: {
                OldPassword: '',
                NewPassword: '',
                ConfirmPassword: '',
                error: '',
                loading: false
            }
        }
        this._EditPassword = this._EditPassword.bind(this)
        this.onBackButtonPressed = this.onBackButtonPressed.bind(this)
    }

static navigationOptions = ({navigation}) => {
        const params = navigation.state.params
        return {
          headerRight: Initial.data.map((val)=>{
            return <TouchableOpacity key={val.ID} style={{
                width: 50,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                right: 5,
                bottom: 3}}
                onPress={() =>params.handleUpdate(val.ID)}>
              <IconButton
              icon='check' size={25}/>
              </TouchableOpacity>
          }) 
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
componentWillMount(){
    this.props.navigation.setParams({ handleUpdate: this._EditPassword})
}    
_onChange = (value) => {
    this.setState({
        value
    })
}

async _EditPassword(id) {
    let DEMO_TOKEN = await deviceStorage.loadJWT("token")
    const value = this.refs.form.getValue()
     //IF the form valid ..
    this.setState({ error: '', loading: true })
    if (value) {
        const data = {
            OldPassword: value.OldPassword,
            NewPassword: value.NewPassword,
            ConfirmPassword: value.ConfirmPassword
        }
        let payload = []
        for (let property in data) {
            let encodedKey = encodeURIComponent(property)
            let encodedValue = encodeURIComponent(data[property])
            payload.push(encodedKey + "=" + encodedValue)
        }
        payload = payload.join("&")
        //sent post request
        if (data.ConfirmPassword !== data.NewPassword){
            alert('confirm password does\'n match with new password')
        } else {
            fetch(`${Config.PaylistApiURL}/editpassword/` + id, {
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
                    this.props.store.setLoading()
                    setTimeout(()=>{
                        alert('Success Update Password')
                        this.props.navigation.navigate('SettingsStack')
                    }, 2000)
                    break
                case 404:
                    alert('Old password doesn\'t match')
                    break
                default:
                alert('Something wrong, please try again later!')
                    break
                }
            })
        }
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
                onChange={this._onChange}
                />
            <View>
                {this.props.store.loading && <View>
                <ActivityIndicator size='small' color='black'/>
                </View>}
            </View>
        </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',
    backgroundColor:'#eee'
    },
})