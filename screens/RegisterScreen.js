import React, { Component } from "react"
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView,
  Modal,
  TextInput,
  Dimensions,
  Image,
  Alert
} from "react-native"
import Config from "../config"
import { inject, observer } from "mobx-react"
import { ActivityIndicator, IconButton, Button } from "react-native-paper"
import { responsiveWidth, responsiveHeight } from "react-native-responsive-dimensions"
let width = Dimensions.get("window").width
let height = Dimensions.get("window").height

@inject("store")
@observer
export default class RegisterScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      email: "",
      username: "",
      password: "",
      ConfirmPassword: "",
      valid: false
    }
    this.props.navigation.setParams({ handleSignUp: this._handleAdd })
  }
  static navigationOptions = ({ navigation }) => {
    let params = navigation.state.params
    return {
      headerRight: (
        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            right: 5,
            bottom: 3
          }}
          onPress={() => params.handleSignUp()}
        >
          <IconButton
            icon="check"
            size={28}
            color="#319e4c"
            activeOpacity={0.5}
          />
        </TouchableOpacity>
      )
    }
  }

  UNSAFE_componentWillMount() {
    this.props.navigation.setParams({ handleSignUp: this._handleAdd })
  }

  _onChange = value => {
    this.setState({
      value
    })
  }

  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  _handleAdd = () => {
    //IF the form valid ..
    let data = {
      name: this.state.name,
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
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
      fetch(`${Config.PaylistApiURL}/user/signup`, {
        //IF the form valid ..
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
          console.log(res)
          switch (resStatus) {
            case 200:
              this.setState({valid: false})
              this.props.store.setLoading()
              setTimeout(() => {
                alert("You may login now")
                this.props.store.getLoading()
                this.props.navigation.navigate("Login")
              }, 2000)
              break
            case 500:
              alert("username exist")
              this.props.store.getLoading()
              break
            default:
              alert("Something wrong, please try again later!")
              this.props.store.getLoading()
              break
          }
        })
        .done()
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="height" style={styles.container}>
        <Image
          source={require("../assets/images/logo.png")}
          style={{
            width: (width * 4) / 5,
            height: height / 4,
            alignSelf: "center"
          }}
          resizeMode="center"
        />
        <ScrollView style={{ alignSelf: "center"}}>
          <TextInput
            value={this.state.name}
            style={styles.textInput}
            placeholder={"name"}
            autoCorrect={false}
            maxLength={32}
            placeholderTextColor={"rgba(255,255,255,0.4)"}
            selectionColor={"white"}
            returnKeyType={"next"}
            blurOnSubmit={false}
            underlineColorAndroid="transparent"
            onChangeText={text => this.setState({ name: text })}
          />
          <TextInput
            value={this.state.email}
            style={styles.textInput}
            placeholder={"email"}
            keyboardType='email-address'
            autoCorrect={false}
            placeholderTextColor={"rgba(255,255,255,0.4)"}
            selectionColor={"white"}
            returnKeyType={"next"}
            blurOnSubmit={false}
            onChangeText={text => this.setState({ email: text })}
          />
          {this.state.valid ? (
          <Text
            style={{
              color: 'red',
              fontSize: 12,
              left: responsiveWidth(3),
              bottom: responsiveHeight(1)
            }}>please insert valid email</Text>
          ) : null }
          <TextInput
            value={this.state.username}
            style={styles.textInput}
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
            style={styles.textInput}
            placeholder={"password"}
            secureTextEntry={true}
            autoCorrect={false}
            placeholderTextColor={"rgba(255,255,255,0.4)"}
            selectionColor={"white"}
            returnKeyType={"next"}
            blurOnSubmit={false}
            onChangeText={text => this.setState({ password: text })}
          />
          <TextInput
            value={this.state.ConfirmPassword}
            style={styles.textInput}
            placeholder={"Confirm password"}
            secureTextEntry={true}
            autoCorrect={false}
            placeholderTextColor={"rgba(255,255,255,0.4)"}
            selectionColor={"white"}
            returnKeyType={"next"}
            blurOnSubmit={false}
            onChangeText={text => this.setState({ ConfirmPassword: text })}
          />
          <Button
            style={styles.button}
            mode="contained"
            onPress={() => {
              if (this.state.name === "" && this.state.email === "" && this.state.username === "" && this.state.password === "" && this.state.ConfirmPassword === ""){
                alert("fields can not be null!")
              } else if (this.state.name === "" || this.state.email === "" || this.state.username === "" ||this.state.password === "" || this.state.ConfirmPassword === ""){
                alert("please fill the blank fields!")
              } else if (this.state.name.length < 4){
                alert('name is too short!')
              } else if (this.state.username.length < 4){
                alert('username is too short!')
              } else if (this.state.password.length < 6){
                alert('password minimal 6 characters')
              } else if (this.state.password != this.state.ConfirmPassword) {
                alert("password and confirm password doesn't match! ")
              } else if (!this.validateEmail(this.state.email)) {
                this.setState({valid: true})
              } else {
                this._handleAdd()
              }
            }}
          >
            <Text style={{fontSize:16, fontWeight:'400'}}>SIGN UP</Text>
          </Button>
          <View style={styles.signupTextCont}>
            <Text style={styles.signupText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Login")}
            >
              <Text style={styles.signupButton}> Login</Text>
            </TouchableOpacity>
          </View>
          <View>
            {this.props.store.loading && (
              <View>
                <ActivityIndicator size="small" color='white' style={{marginTop:7}}/>
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
    backgroundColor: "#2e2d2d",
    flex: 1,
   height:'100%'
  },
  signupTextCont: {
    flex: 2,
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
  },
  button: {
    borderRadius: 4,
    padding: 3,
    borderRadius: 15,
    textAlign: "center",
    marginBottom: 10,
    backgroundColor: "#8CAD81"
  }, 
  textInput:{
    backgroundColor: "#5e5e5e",
    borderRadius: 15,
    marginBottom: 10,
    width: (width * 4) / 5,
    height: 55,
    paddingLeft:15,
    color:'white'
  }
})
