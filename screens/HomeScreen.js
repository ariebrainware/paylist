import React from "react"
import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  View,
  BackHandler, Text,
  Alert, Dimensions, Modal, TextInput,
} from "react-native"
import Config from "../config"
import deviceStorage from "../service/deviceStorage"
import { createFilter } from "react-native-search-filter"
import {
  List,
  Card,
  Checkbox,
  Button,
  ActivityIndicator,
  Provider,
  Portal,
  FAB, IconButton
} from "react-native-paper"
import { observer, inject } from "mobx-react"
import { widthPercentageToDP } from "react-native-responsive-screen"
let width = Dimensions.get('window').width
let height = Dimensions.get('window').height

let KEYS_TO_FILTERS = ["CreatedAt", "name"]
@inject("store")
@observer
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Search: "",
      open: false,
      checked: false,
      data:[],
      isLoad:false,
      balance:''
    }
    this._DeletePaylist = this._DeletePaylist.bind(this)
    this._GetData = this._GetData.bind(this)
    this._AddBalance = this._AddBalance.bind(this)
    this._GetDataUser = this._GetDataUser.bind(this)
  }

  componentDidMount() {
    const temp = []
    let { navigation } = this.props
    this.focusListener = navigation.addListener("didFocus", () => {
      setTimeout(() => {
        this._GetData()
        this._GetDataUser()
      }, 2000)
    })
  }
  currencyFormat(num) {
    return (
      "Rp " +
      parseInt(num)
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    )
  }
  UNSAFE_componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackButtonPressed)  
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.onBackButtonPressed
    )
    this.focusListener.remove()
  }

  onBackButtonPressed() {
    BackHandler.exitApp()
    return true
  }
  onRefresh() {
    this.props.store.paylist
    this.props.store.setLoadingHome()
    setTimeout(() => {
      this._GetData()
    }, 1000)
  }

  LoadState(){
    this.setState({
      isLoad : !this.state.isLoad,
      balance:''
    })
  }

  async _GetData() {
    let DEMO_TOKEN = await deviceStorage.loadJWT("token")
    let header = {
      Authorization: DEMO_TOKEN
    }
    fetch(`${Config.PaylistApiURL}/paylist`, {
      method: "GET",
      headers: header
    })
      .then(res => {
        this.props.store.getLoading()
        resStatus = res.status
        return res.json()
      })
      .then(resJson => {
        this.setState({data : resJson.data})
        switch (resStatus) {
          case 200:
            let list = JSON.stringify(resJson.data)
            let json = JSON.parse(list)
            this.setState({data : json})
            this.props.store.paylist = json
            this.props.store.getLoadingHome()
            break
          case 500:
            alert("Token Expired")
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
  }

  // searchUpdated(term) {
  //   this.setState({ Search: term })
  // }

  async _AddBalance(){
    let DEMO_TOKEN = await deviceStorage.loadJWT("token")
    
      let data = {
        balance: this.state.balance,
      }
      let payload = []
      for (let property in data) {
        let encodedKey = encodeURIComponent(property)
        let encodedValue = encodeURIComponent(data[property])
        payload.push(encodedKey + "=" + encodedValue)
      }
      payload = payload.join("&")
      let header= {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept : 'application/x-www-form-urlencoded',
        'Authorization': DEMO_TOKEN
      }
      //sent post request
      fetch(`${Config.PaylistApiURL}/addsaldo`, {
        method: 'POST',
        headers: header,
        body: payload
      })
      .then(res => {
        switch (res.status) {
          case 200:
            this.LoadState()
            this._GetDataUser()
            setTimeout(()=>{
              alert('Success Add Balance')
              },2000)
            break
          case 400:
            alert('field can\'t be negative or zero')
            this.props.store.getLoading()
            break
        }      
    })
      .catch(err => {
        console.error(err)
      })
      .done()
  }

  async _DeletePaylist(id) {
    let DEMO_TOKEN = await deviceStorage.loadJWT("token")
    let header = {
      Authorization: DEMO_TOKEN
    }
    fetch(`${Config.PaylistApiURL}/paylist/` + id, {
      method: "DELETE",
      headers: header
    })
      .then(res => {
        resStatus = res.status
        return res.json()
      })
      .then(res => {
        switch (resStatus) {
          case 200:
            setTimeout(() => {
              alert("Delete Paylist Success")
              this._GetData()
            }, 1000)
            break
          case 404:
            alert("No Paylist Found")
            break
          case 400:
            alert("Specify Paylist ID")
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

  Confirm(item) {
    Alert.alert(
      "Confirm",
      "Do you want to delete this paylist?",
      [
        { text: "Delete", onPress: () => this._DeletePaylist(item) },
        { text: "Cancel", style: "cancel" }
      ],
      { cancelable: true }
    )
  }

  ConfirmCheck(item) {
    Alert.alert(
      "Confirm",
      "Are you sure you have paid this item?",
      [
        { text: "Yes", onPress: () => this._UpdatePaylistStatus(item) },
        { text: "Cancel", style: "cancel" }
      ],
      { cancelable: true }
    )
  }

  async _UpdatePaylistStatus(id) {
    let DEMO_TOKEN = await deviceStorage.loadJWT("token")
    let header = {
      Authorization: DEMO_TOKEN
    }
    fetch(`${Config.PaylistApiURL}/status/` + id, {
      method: "PUT",
      headers: header
    })
      .then(res => {
        resStatus = res.status
        return res.json()
      })
      .then(res => {
        switch (resStatus) {
          case 200:
            setTimeout(()=>{
              this.setState({
                checked: this.state[id]
              })
              alert("Your data has been move to report as PAID Paylist")
              this._GetData()
            },2000)
            break
          case 404:
            alert("No Paylist Found")
            break
          case 400:
            alert("Specify Paylist ID")
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

  render() {
    console.log(this.state.data)
    if (this.props.store.loadingHome){
      return (
        <View style={{flex:1, paddingTop:10}}>
          <ActivityIndicator color='black' />
          </View>
      )                                                           
    } 
    // else if (this.state.data == ""){
    //     return (
    //       <View style={{backgroundColor:'transparent', justifyContent:'center', alignItems:'center',backfaceVisibility:'visible'}}>
    //         <IconButton icon="playlist-add" size={30}></IconButton>
    //         <Text style={{fontSize:14}}>No Data</Text>
    //       </View>
    //     )
    //   }
    // let filteredPaylist = this.props.store.paylist.filter(
    //   createFilter(this.state.Search, KEYS_TO_FILTERS)
    // )
    let { checked } = this.state
    let paid = <Text style={{flex:1, flexWrap:'wrap', color:'#8CAD81'}}>PAID</Text>
    let unpaid = <Text style={{color:'#8CAD81'}}>UNPAID</Text>
    let message
    let pay = this.props.store.paylist.map(item => {
      if (item.completed == false && item.DueDate != '0001-01-01T00:00:00Z') {
      let tgl = new Date(item.CreatedAt)
      let due_date = new Date(item.DueDate)
      if (item.completed == false) {
        checked = false
        message = unpaid
      }
      return (
        <Card key={item.ID} style={styles.Item}>
          <List.Accordion style={{backgroundColor:'#f2f2f0'}}
            titleStyle={{ color: "#8CAD81" }}
            title={item.name}
            left={props => <List.Icon {...props} icon="monetization-on" color='#8CAD81'/>}
          >
            <View style={{flexDirection:'row', alignItems:'center', right:50}}>
            <Checkbox
                status={checked ? "checked" : "unchecked"}
                color="#8CAD81"
                uncheckedColor="#8CAD81"
                onPress={this.ConfirmCheck.bind(this, item.ID)}
              />{message}
            <List.Item
              titleStyle={{color: "black", fontSize:20, fontWeight:'bold',alignSelf:'flex-end' }}
              style={{flex:1}}
              title={this.currencyFormat(item.amount)}
            /></View>
            <View style={{flexDirection:'row', alignItems:'center', right:45}}>
            <Text style={{fontSize:17, fontWeight:'300', color:'#6e6e6e',alignSelf:'center'}}>Due Date :</Text>
            <List.Item
              titleStyle={{ color: "black" }}
              style={{flex:1}}
              title={due_date.toDateString()}
            /></View>
            <View style={{flexDirection:'row', alignItems:'center', right:45}}>
            <Text style={{fontSize:17, fontWeight:'300', color:'#6e6e6e'}}>Created At :</Text>
            <List.Item style={{ flex:1 }} title={tgl.toDateString()} /></View>
            <Card.Actions style={{ flex:1, alignSelf:'flex-end' }}>
              <Button
                color="red"
                onPress={this.Confirm.bind(this, item.ID)}
                icon="delete"
              >
                Delete
              </Button>
              <Button
                color="black"
                icon="edit"
                onPress={() =>
                  this.props.navigation.navigate("UpdatePaylist", {
                    id: item.ID,
                    name: JSON.stringify(item.name),
                    amount: JSON.stringify(item.amount),
                    due_date: JSON.stringify(due_date)
                  })
                }
              >
                edit
              </Button>
            </Card.Actions>
          </List.Accordion>
        </Card>
      )
    } else if (item.completed == false && item.DueDate == '0001-01-01T00:00:00Z'){
      let tgl = new Date(item.CreatedAt)
      let unpaid = <Text style={{color:'#8CAD81'}}>UNPAID</Text>
      let message
      if (item.completed == false) {
        checked = false
        message = unpaid
      }
      return (
        <Card key={item.ID} style={styles.Item}>
          <List.Accordion style={{backgroundColor:'#f2f2f0'}}
            titleStyle={{ color: "#8CAD81" }}
            title={item.name}
            left={props => <List.Icon {...props} icon="monetization-on" color='#8CAD81'/>}
          >
            <View style={{flexDirection:'row', right:50, alignItems:'center'}}>
            <Checkbox
                status={checked ? "checked" : "unchecked"}
                color="#8CAD81"
                uncheckedColor="#8CAD81"
                onPress={this.ConfirmCheck.bind(this, item.ID)}
              />{message}
            <List.Item
              titleStyle={{color: "black", fontSize:20, fontWeight:'bold',alignSelf:'flex-end'}}
              style={{flex:1}}
              title={this.currencyFormat(item.amount)}
            /></View>
            <View style={{flexDirection:'row', right:45}}>
            <Text style={{fontSize:17, fontWeight:'300', color:'#6e6e6e',alignSelf:'center'}}>Due Date :</Text>
            <List.Item
              titleStyle={{ color: "black" }}
              style={{flex:1}}
              title={'-'}
            /></View>
            <View style={{flexDirection:'row', alignItems:'center', right:45}}>
            <Text style={{fontSize:17, fontWeight:'300', color:'#6e6e6e'}}>Created At :</Text>
            <List.Item style={{ flex:1 }} title={tgl.toDateString()} /></View>
            <Card.Actions style={{ flex:1, alignSelf:'flex-end' }}>
              <Button
                color="red"
                onPress={this.Confirm.bind(this, item.ID)}
                icon="delete"
              >
                Delete
              </Button>
              <Button
                color="black"
                icon="edit"
                onPress={() =>
                  this.props.navigation.navigate("UpdatePaylist", {
                    id: item.ID,
                    name: JSON.stringify(item.name),
                    amount: JSON.stringify(item.amount),
                    due_date: JSON.stringify('')
                  })
                }
              >
                edit
              </Button>
            </Card.Actions>
          </List.Accordion>
        </Card>
      )
    }
  })
    return (
      <Provider>
        <View style={styles.container}>
          <View>
            <Card style={{ backgroundColor: "#2e2d2d",shadowColor:'transparent',elevation:0}}>
              <Card.Content
                style={{ backgroundColor: "#2e2d2d", alignSelf:'center' }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 15, color:'#8CAD81'}}>
                  Total Expense :
                  {this.currencyFormat(
                  this.props.store.paylist.filter(({completed})=> completed === false)
                  .reduce(
                    (sum, i) => (total = sum + i.amount),0
                  )
                  )}
                </Text>
              </Card.Content>
            </Card>
          </View> 
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            refreshControl={
              <RefreshControl
                //refresh control used for the Pull to Refresh
                refreshing={this.props.store.loadingHome}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
          >
          {pay}
          </ScrollView>
          <Modal visible={this.state.isLoad} animationType="slide" animated={true} transparent={true}>
            <View style={{flex:1, width:300, height:100, alignSelf:'center', justifyContent:'center'}}>
             <View style={{backgroundColor:'#454545', borderRadius:5}}> 
            <Text style={{alignSelf:'center', fontSize:20, color:'#ccbc58', marginBottom:10, marginTop:10}}>Add Balance</Text>
            <TextInput value={this.state.balance} style={styles.textInput} 
            placeholderTextColor={"rgba(255,255,255,0.4)"}
             keyboardType="numeric"
            selectionColor={"white"} 
            placeholder='balance' onChangeText={(text)=> this.setState({balance: text})} />
            <View style={{flexDirection:'row', alignSelf:'center'}}>
            <Button style={styles.button} mode="contained"
                onPress={() => this._AddBalance()}>
                <Text>Save</Text>
              </Button>
              <Button style={styles.button} mode="contained"
                onPress={() => this.LoadState()}>
                <Text>Cancel</Text>
              </Button></View>
            </View>
            </View>
          </Modal>
          <Portal>
            <FAB.Group
              fabStyle={{ backgroundColor: "#8CAD81"}}
              open={this.state.open}
              icon={this.state.open ? "close" : "add"}
              actions={[
                {
                  style: { backgroundColor: "#F9E48A" },
                  color: "black",
                  icon: "create",
                  label: "Balance",
                  onPress: () => this.LoadState()
                },
                {
                  style: { backgroundColor: "#F9E48A" },
                  color: "black",
                  icon: "playlist-add",
                  label: "Paylist",
                  onPress: () => this.props.navigation.navigate("CreatePaylist")
                }
              ]}
              onStateChange={({ open }) => this.setState({ open })}
              onPress={() => {
                if (this.state.open) {
                  // do something if the speed dial is open
                }
              }}
            />
          </Portal>
          {this.props.store.loadingHome && <View style={{position:'absolute', paddingTop:10}}>
          <ActivityIndicator color='black' />
          </View>}
        </View>
      </Provider>
    )
  }
}

HomeScreen.navigationOptions = {
  title: "Home",
  headerTintColor: '#fff',
  headerStyle: {
    backgroundColor: "#2e2d2d",
    shadowColor:'transparent', 
    elevation:0,
    borderBottomWidth:0.5,
    borderBottomColor: '#70706e'
  }
}
let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2e2d2d"
  },
  contentContainer: {
    paddingTop: 10
  },
  TouchableOpacityStyle: {
    position: "absolute",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30
  },
  FloatingButtonStyle: {
    resizeMode: "contain",
    width: 50,
    height: 50
  },
  Item: {
    width: widthPercentageToDP("96%"),
    flex:1,
    alignSelf:'center',
    margin: 1.5,
    padding: 3.5,
    backgroundColor:'#f2f2f0',
    justifyContent:'center'
  },
  content: {
    backgroundColor: "#ffff",
    margin: 0.5
  },
  button:{
    borderRadius: 4,
      fontSize:20,
      padding: 3,
      borderRadius: 15,
      textAlign: "center",
      marginBottom: 10,
      backgroundColor: "#8CAD81",
      width:widthPercentageToDP(33),
      justifyContent:'space-between'
    },
    textInput:{
      fontSize:17,
      backgroundColor: 'transparent',
      borderBottomWidth:0.5,  
      borderBottomColor:'#8CAD81',
      marginBottom: 10,
      width: 250,
      height: 55, 
      color:'white', 
      alignSelf:'center'
    }
})
