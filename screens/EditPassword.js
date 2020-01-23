import React, { Component } from "react"
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  BackHandler,
  Modal, TextInput
} from "react-native"
import Config from "../config"
import deviceStorage from "../service/deviceStorage"
import Initial from "../State.js"
import { observer, inject } from "mobx-react"
import { IconButton, ActivityIndicator } from "react-native-paper"

@inject("store")
@observer
export default class EditPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        OldPassword: "",
        NewPassword: "",
        ConfirmPassword: "",
    }
   
    this._EditPassword = this._EditPassword.bind(this)
    this.onBackButtonPressed = this.onBackButtonPressed.bind(this)
  }

  static navigationOptions = ({ navigation }) => {
    let params = navigation.state.params
    return {
      headerRight: Initial.data.map(val => {
        return (
          <TouchableOpacity
            key={val.ID}
            style={{
              width: 50,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              right: 5
            }}
            onPress={() => params.handleUpdate(val.ID)}
          >
            <IconButton
              icon="check"
              size={28}
              color="#8CAD81"
              activeOpacity={0.5}
            />
          </TouchableOpacity>
        )
      })
    }
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackButtonPressed)
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.onBackButtonPressed
    )
  }
  onBackButtonPressed() {
    this.props.navigation.navigate("Main")
    return true
  }
  UNSAFE_componentWillMount(){
      this.props.navigation.setParams({ handleUpdate: this._EditPassword})
  }
  _onChange = value => {
    this.setState({
      value
    })
  }

  async _EditPassword(id) {
    let DEMO_TOKEN = await deviceStorage.loadJWT("token")
    //IF the form valid ..
      let data = {
        OldPassword: this.state.OldPassword,
        NewPassword: this.state.NewPassword,
        ConfirmPassword: this.state.ConfirmPassword
      }
      let payload = []
      for (let property in data) {
        let encodedKey = encodeURIComponent(property)
        let encodedValue = encodeURIComponent(data[property])
        payload.push(encodedKey + "=" + encodedValue)
      }
      payload = payload.join("&")
      //sent post request
      if (data.ConfirmPassword !== data.NewPassword) {
        alert("confirm password does'n match with new password")
      } else {
        fetch(`${Config.PaylistApiURL}/editpassword/` + id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/x-www-form-urlencoded",
            Authorization: DEMO_TOKEN
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
                setTimeout(() => {
                  alert("Success Update Password")
                  this.props.navigation.navigate("SettingsStack")
                  this.props.store.getLoading()
                }, 2000)
                break
              case 404:
                alert("Old password doesn't match")
                this.props.store.getLoading()
                break
              default:
                alert("Something wrong, please try again later!")
                this.props.store.getLoading()
                break
            }
          })
      }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <TextInput
            value={this.state.OldPassword}
            style={styles.textInput}
            placeholder={"Old Password"}
            secureTextEntry={true}
            autoCorrect={false}
            placeholderTextColor={"rgba(255,255,255,0.8)"}
            selectionColor={"white"}
            returnKeyType={"next"}
            blurOnSubmit={false}
            onChangeText={text => this.setState({ OldPassword: text })}
          />
          <TextInput
            value={this.state.NewPassword}
            style={styles.textInput}
            placeholder={"New Password"}
            secureTextEntry={true}
            autoCorrect={false}
            placeholderTextColor={"rgba(255,255,255,0.8)"}
            selectionColor={"white"}
            returnKeyType={"next"}
            blurOnSubmit={false}
            onChangeText={text => this.setState({ NewPassword: text })}
          />
          <TextInput
            value={this.state.ConfirmPassword}
            style={styles.textInput}
            placeholder={"Confirm password"}
            secureTextEntry={true}
            autoCorrect={false}
            placeholderTextColor={"rgba(255,255,255,0.8)"}
            selectionColor={"white"}
            returnKeyType={"next"}
            blurOnSubmit={false}
            onChangeText={text => this.setState({ ConfirmPassword: text })}
          />
          <View>
            {this.props.store.loading && (
              <View>
                <ActivityIndicator
                  size="small"
                  color="white"
                  style={{ marginTop: 7 }}
                />
              </View>
            )}
          </View>
        </ScrollView>
        <Modal
          transparent={true}
          animationType="fade"
          visible={this.props.store.loading}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.1)"
            }}
          ></View>
        </Modal>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2e2d2d",
    padding: 10,
    flexDirection: "column"
  },
  textInput:{
    fontSize:17,
    backgroundColor: 'transparent',
    borderBottomWidth:0.5,  
    borderBottomColor:'#8CAD81',
    marginBottom: 10,
    width:400,
    height: 55, 
    color:'white', 
    alignSelf:'center'
  }
})
