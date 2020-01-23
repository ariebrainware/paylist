import React, { Component } from "react"
import {
  ScrollView,
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  Image,
  KeyboardAvoidingView,Alert
} from "react-native"
import deviceStorage from "../service/deviceStorage"
import { Button, ActivityIndicator, IconButton } from "react-native-paper"
import Config from "../config"
import { observer, inject } from "mobx-react"
let width = Dimensions.get("window").width
let height = Dimensions.get("window").height

@inject("store")
@observer
export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
      error: ""
    }
    this._handleLogin = this._handleLogin.bind(this)
  }

  componentWillUnmount() {
    this.setState = {
      value: {
        username: "",
        password: null,
        error: ""
      }
    }
  }

  componentDidMount() {
    this.loadInitialState().done()
    this.props.store.getLoading()
  }

  async loadInitialState() {
    let token = await deviceStorage.loadJWT("token")
    if (token != null) {
      this.props.navigation.navigate("Main")
    } else {
      this.props.navigation.navigate("Login")
    }
  }
  _onChange = value => {
    this.setState({
      value
    })
  }

  clearForm(){
    // clear content from all textbox
    this.setState({
      username:'',
      password:''
    })
  }

  _handleLogin() {
    // If the form is valid...
    let data = {
      username: this.state.username,
      password: this.state.password
    }
    let payload = []
    for (let property in data) {
      let encodedKey = encodeURIComponent(property)
      let encodedValue = encodeURIComponent(data[property])
      payload.push(encodedKey + "=" + encodedValue)
    }
    payload = payload.join("&")
    //sent post request
    fetch(`${Config.PaylistApiURL}/user/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/x-www-form-urlencoded"
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
            let token = { type: "sensitive", value: res.data }
            deviceStorage.saveKey("token", JSON.stringify(token))
            this.props.store.setLoading()
            setTimeout(() => {
              alert("Login Success")
              this.props.navigation.navigate("Main")
              this.props.store.getLoading()
            }, 2000)
            this.clearForm()
            break
          case 404:
            this.props.store.setLoading()
            setTimeout(() => {
              alert("wrong username or password")
              this.props.store.getLoading()
            }, 2000)
            this.clearForm()
            break
          case 307:
            setTimeout(() => {
              alert("already login")
              this.props.navigation.navigate("Main")
              this.props.store.getLoading()
            })
            this.clearForm()
            break
          default:
            this.props.store.getLoading()
            alert("Something wrong, please try again later!")
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
      <KeyboardAvoidingView style={styles.container} enabled>
        <Image
          source={require("../assets/images/logo.png")}
          style={{
            width: (width * 4) / 5,
            height: height / 4,
            alignSelf: "center"
          }}
          resizeMode="center"
        />
        <ScrollView style={{ alignSelf: "center" }}>
          <TextInput
            value={this.state.username}
            style={{
              backgroundColor: "#5e5e5e",
              borderRadius: 15,
              marginBottom: 10,
              width: (width * 4) / 5,
              height: 55, paddingLeft:15,color:'white'
            }}
            placeholder={"username"}
            autoCorrect={false}
            maxLength={32}
            placeholderTextColor={"rgba(255,255,255,0.4)"}
            selectionColor={"white"}
            returnKeyType={"next"}
            blurOnSubmit={false}
            underlineColorAndroid="transparent"
            onChangeText={text => this.setState({ username: text })}
          />
          <TextInput
            value={this.state.password}
            style={{
              backgroundColor: "#5e5e5e",
              borderRadius: 15,
              marginBottom: 10,
              width: (width * 4) / 5,
              height: 55, paddingLeft:15,color:'white'
            }}
            placeholder={"password"}
            secureTextEntry={true}
            autoCorrect={false}
            placeholderTextColor={"rgba(255,255,255,0.4)"}
            selectionColor={"white"}
            returnKeyType={"next"}
            blurOnSubmit={false}
            onChangeText={text => this.setState({ password: text })}
          />
          <Button
            style={styles.button}
            mode="contained"
            onPress={() => {
              if (this.state.username === "" && this.state.password === "") {
                alert("please provide username and password")
              } else if (
                this.state.username === "" ||
                this.state.password === ""
              ) {
                alert("username and password can not be null!")
              } else {
                this._handleLogin()
              }
            }} 
          >
           <Text style={{fontSize:16, fontWeight:'400'}}>LOGIN</Text>
          </Button>
          <View style={styles.signupTextCont}>
            <Text style={styles.signupText}>Don't have an account yet?</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Register")}
            >
              <Text style={styles.signupButton}> Sign Up</Text>
            </TouchableOpacity>
          </View>
          <View>
            {this.props.store.loading && (
              <View>
                <ActivityIndicator size="small" color='white' style={{marginTop:7}} />
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
      </KeyboardAvoidingView>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2e2d2d"
  },
  button: {
    borderRadius: 4,
    fontSize:20,
    padding: 3,
    borderRadius: 15,
    textAlign: "center",
    marginBottom: 10,
    backgroundColor: "#8CAD81",
  },
  centering: {
    alignItems: "center",
    justifyContent: "center"
  },
  signupTextCont: {
    alignItems: "flex-end",
    justifyContent: "center",
    paddingVertical: 3,
    flexDirection: "row"
  },
  signupText: {
    color: 'rgba(255, 255, 255,0.5)',
    fontSize: 16
  },
  signupButton: {
    color: "#ccbc58",
    fontSize: 16,
    fontWeight: "500"
  }
})
