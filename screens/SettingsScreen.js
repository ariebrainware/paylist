import React from "react"
import { DrawerActions } from "react-navigation-drawer"
import {
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
  Text, Dimensions, KeyboardAvoidingView, Alert, Modal
} from "react-native"
import deviceStorage from "../service/deviceStorage"
import {
  Card,
  Button,
  Title,
  Paragraph,
  Appbar,
  ActivityIndicator,
  TextInput,
  IconButton
} from "react-native-paper"
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Config from "../config"
import { observer, inject } from "mobx-react"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen"

let width = Dimensions.get("window").width
let height = Dimensions.get("window").height

@inject("store")
@observer
export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      render: false,
      email: "",
      name: "",
      balance: "",
      id:'',
      data: [],
    }
    this._GetDataUser = this._GetDataUser.bind(this)
    this._UpdateUser = this._UpdateUser.bind(this)
    this._GetDataIncome = this._GetDataIncome.bind(this)
    this._DeleteIncome = this._DeleteIncome.bind(this)
  }

  currencyFormat(num) {
    return (
      "Rp: " +
      parseInt(num)
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    )
  }

  // _onMore = () => {
  //   //Props to open/close the drawer
  //   this.props.navigation.dispatch(DrawerActions.openDrawer())
  // }

  static navigationOptions = ({ navigation }) => {
    let params = navigation.state.params
    return {
      title: "PROFILE",
      headerTintColor: "#fff",
      headerStyle: {
        backgroundColor: "#2e2d2d",
        shadowColor: "transparent",
        elevation: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: "#70706e"
      },
    }
  }
  Capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  UNSAFE_componentWillMount() {
    let { navigation } = this.props
    this.focusListener = navigation.addListener("didFocus", () => {
    this._GetDataUser()
    this.props.store.data.map((item) => {
      return (
        this.setState({
          id : item.ID,
          email: item.email,
          name: item.name,
          balance: item.balance
      })
      )
    })
  })
    // this.props.navigation.setParams({ showMore: this._onMore.bind(this) })
  }

  Confirm(item) {
    Alert.alert(
      "Confirm",
      "Do you want to delete this paylist?",
      [
        { text: "Delete", onPress: () => this._DeleteIncome(item) },
        { text: "Cancel", style: "cancel" }
      ],
      { cancelable: true }
    )
  }
  componentDidMount() {
    let { navigation } = this.props
    this.focusListener = navigation.addListener("didFocus", () => {
      setTimeout(() => {
        this._GetDataIncome()
        this._GetDataUser()
      }, 1000)
    })
    loc(this)
  }

  async _GetDataIncome(){
    let DEMO_TOKEN = await deviceStorage.loadJWT("token")
    let header = {
      Authorization: DEMO_TOKEN
    }
    fetch(`${Config.PaylistApiURL}/income`, {
      method: "GET",
      headers:header
    })
    .then(res =>{
      let resStatus = res.status
      console.log(resStatus)
      return res.json()
    })
    .then(ress =>{
      switch(resStatus){
          case 200:
            let dataString = JSON.stringify(ress.data)
            let dataParse = JSON.parse(dataString)
            console.log('dataa', dataParse)
            this.props.store.income = dataParse
            this.props.store.getLoadingSetting()
          break
          case 500:
            alert("token expired")
            setTimeout(() => {
              this.props.navigation.navigate("Login")
            }, 2000)
          break
          case 401:
            alert("Unauthorized")
            setTimeout(() => {
              this.props.navigation.navigate("Login")
            }, 2000)
          break
      }
    })
    .catch(error => {
      console.log(error)
    })
    .done()
  }

  async _DeleteIncome(id){
    let DEMO_TOKEN = await deviceStorage.loadJWT("token")
    let header = {
      Authorization: DEMO_TOKEN
    }
    fetch(`${Config.PaylistApiURL}/income/` + id,{
      method: "DELETE",
      headers: header
    })
    .then(res=>{
      resStatus = res.status
      return res.json()
    })
    .then(res => {
      switch (resStatus) {
        case 200:
          this.props.store.setLoadingSetting()
          setTimeout(() => {
            alert("Delete Income Success")
            this._GetDataIncome()
            this._GetDataUser()
            this.props.store.getLoadingSetting()
          }, 1500)
          break
        case 404:
          alert("No ID Found")
          break
        case 400:
          alert("Specify Income ID")
          break
        case 500:
          alert("Token Expired")
          this.props.navigation.navigate("Login")
          break
        default:
          alert("Something wrong, please try again later!")
          break
      }
    })
    .done()
  }

  async _GetDataUser() {
    let DEMO_TOKEN = await deviceStorage.loadJWT("token")
    let header = {
      Authorization: DEMO_TOKEN
    }
    fetch(`${Config.PaylistApiURL}/users`, {
      method: "GET",
      headers: header
    })
      .then(res => {
        resStatus = res.status
        return res.json()
      })
      .then(ress => {
        switch (resStatus) {
          case 200:
            let dataString = JSON.stringify(ress.data)
            let dataParse = JSON.parse(dataString)
            this.props.store.data = dataParse
            this.props.store.getLoadingSetting()
            break
          case 500:
            alert("token expired")
            this.props.navigation.navigate("Login")
            break
          case 401:
            alert("Unauthorized")
            setTimeout(() => {
              this.props.navigation.navigate("Login")
            }, 2000)
            break
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  async _UpdateUser(id) {
    let DEMO_TOKEN = await deviceStorage.loadJWT("token")
       // If the form is valid...
    
      let data = {
        name: this.state.name,
        email: this.state.email,
        balance: this.state.balance,
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
      fetch(`${Config.PaylistApiURL}/user/` + id, {
        method: 'PUT',
        headers: header,
        body: payload
      })
        .then(res => {
          switch (res.status) {
            case 200:
              this.LoadState()
              this.props.store.setLoadingSetting()
              setTimeout(() => {
                alert('Success Edit Data')
                this.props.store.getLoadingSetting()
                this._GetDataUser()
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

  
  componentWillUnmount() {
    rol()
    this.focusListener.remove()
  }
  LoadState() {
    this.setState({
      render: !this.state.render,
    })
  }
  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  onRefresh() {
    this.props.store.setLoadingSetting()
    this._GetDataIncome()
    setTimeout(() => {
      this._GetDataUser()
    }, 500)
    this.setState({render : false})
  }

  render() {
    console.log(this.props.store.income.length)
    if (this.props.store.loadingSetting) {
      return (
        <View style={{ padding: 20 }}>
          <ActivityIndicator color='black' />
        </View>
      )
    }
    let user = this.props.store.data.map((val, i) => {
      return (
        <Card key={i} style={{ backgroundColor: "#2e2d2d" }}>
          <Card style={styles.username}>
            <Card.Content style={styles.content}>
              <Title style={{color:'#fefefe', fontWeight:'bold'}}>{this.Capitalize(val.name)}</Title>
              <Paragraph style={{color:'#fefefe', fontWeight:'bold'}}>{val.email}</Paragraph>
            </Card.Content>
          </Card>
          <Card style={{ margin: 1, width: wp("98%"), alignSelf: "center",shadowColor:'transparent', elevation:0 }}>
            <Card.Content style={styles.balance}>
              <Paragraph style={{ fontWeight: "bold", fontSize: 15, color:'#f2f5fa',alignSelf:'center' }}>
                Your Balance
              </Paragraph></Card.Content>
              <Card.Content style={{backgroundColor:'#ccbc58',height:50,justifyContent:'center'}}>
              <Paragraph style={{ fontWeight: "bold", color:'rgba(0,0,0,0.7)',alignSelf:'center', fontSize:21}}>
                {this.currencyFormat(val.balance)}
              </Paragraph></Card.Content>
            <Card.Actions style={{ backgroundColor: '#2e2d2d', shadowColor:'transparent', elevation:0}}>
              <Button 
                color="#ccbc58"
                onPress={() => this.LoadState()}
                icon="mode-edit"
              >
                Edit Data
              </Button>
            </Card.Actions>
          </Card>
        </Card>
      )
    })
    return (
      <KeyboardAvoidingView behavior="height" style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={this.props.store.loadingSetting}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
        >
          {user}
          <View style={{flex:2,shadowColor:'transparent',elevation:0}}>
              {this.state.render ? (
                <Card style={styles.editForm}>
                  <TextInput
                    label="Name" theme={{
                      colors:{
                      text:'#ccbc58',placeholder:'#b5b3b3',
                      primary:'#ccbc58'
                    }
                    }}
                    value={this.state.name}
                    style={styles.textInput}
                   
                    onChangeText={text => this.setState({ name: text })}
                  />
                  <TextInput
                    label="Email" theme={{
                      colors:{
                      text:'#ccbc58',
                      placeholder:'#b5b3b3',
                      primary:'#ccbc58'
                    }
                    }}
                    value={this.state.email}
                    style={styles.textInput}
                    
                    keyboardType="email-address"
                    onChangeText={text => this.setState({ email: text })}
                  />
                  <Button style={styles.button} mode="contained"
                    onPress={() => {
                      if (!this.validateEmail(this.state.email)){
                        Alert.alert('Error', 'Please insert valid email')
                      } else {
                      this._UpdateUser(this.state.id)
                      }
                    }}
                  >
                    <Text>Save</Text>
                  </Button>
                </Card>
              ) : null}
          </View>
          {
            this.props.store.income !== 'undefined' && this.props.store.income.length > 0 ? (
            <View style={{flex:4}}>
              {
                this.props.store.income.map((val,key) => {
                let date =  new Date(val.CreatedAt)
                return (
                <Card key={key} style={{width: width-30, height: height/7, backgroundColor:'rgba(255,255,255,0.9)', alignSelf:'center', marginTop: hp(1)}}>
                  <Card.Content style={{flexDirection:'row', justifyContent: 'space-between'}}>
                    <Text style={{fontSize:18, fontWeight:'bold'}}>Income</Text>
                    <Text>{this.currencyFormat(val.Income)}</Text>
                  </Card.Content>
                  <Card.Content>
                    <Paragraph>{date.toDateString()}</Paragraph>
                  </Card.Content>
                  <Card.Actions style={{alignSelf: 'flex-end'}}>
                    <Button
                      icon="delete"
                      onPress={this.Confirm.bind(this, val.ID)}
                      color='rgba(255, 16, 0,0.8)'
                    >Delete</Button>
                    <Button
                      icon="edit"
                      color='black'
                      onPress={() => this.props.navigation.navigate('EditInc', {
                        income: JSON.stringify(val.Income),
                        id: JSON.stringify(val.ID)
                      })}
                    >edit</Button>
                  </Card.Actions>
                </Card>
              )
            })
          }
          </View>
          ): (
            <View style={{ paddingTop: 25, backgroundColor: 'transparent', alignItems: 'center' }}>
              <MaterialIcon name='clipboard-text-outline' size={50} color={'gray'} />
              <Text style={{ fontSize: 16, color: 'gray' }}>Opps! You have no adding income</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2e2d2d"
  },
  username: {
    flex: 2,
    alignSelf: "center",
    width: wp("98%"),
    height: hp("11%"),
    backgroundColor: "#2e2d2d",
    shadowColor:'transparent', 
    elevation:0,
  },
  content: {
    flex: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:'#8CAD81'
  },
  balance: {
    flex: 3,
    paddingTop: 10,
    fontWeight: "400",
    backgroundColor: "#2e2d2d",
    shadowColor:'transparent', 
    elevation:0,
  },
  textInput:{
    backgroundColor:'transparent',
    borderBottomWidth:0.5, 
    borderBottomColor:'#8CAD81',
    marginTop:5,
  },
  button:{
    borderRadius: 4,
    fontSize:20,
    padding: 3,
    borderRadius: 15,
    textAlign: "center",
    backgroundColor: "#8CAD81",
    width:wp(33),
    justifyContent:'center',
    alignSelf:'center',
    marginTop:10
    },
    editForm:{
      backgroundColor:'#2e2d2d',
      width: wp("98%"), 
      alignSelf: "center",
      justifyContent:'center',
      shadowColor:'transparent', 
      elevation:0 
    }
})
