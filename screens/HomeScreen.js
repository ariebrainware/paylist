import React from "react"
import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  View,
  BackHandler, Text,
  Alert, Dimensions, Modal, TextInput,
} from "react-native"
import { DrawerActions } from "react-navigation-drawer"
import Config from "../config"
import deviceStorage from "../service/deviceStorage"
import {List,Card,Checkbox,Button,ActivityIndicator,Provider,Portal,FAB,Appbar, IconButton} from "react-native-paper"
import { observer, inject } from "mobx-react"
import { widthPercentageToDP } from "react-native-responsive-screen"

let width = Dimensions.get('window').width
let height = Dimensions.get('window').height

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
      balance:'',
      coba:[]
    }
    this._DeletePaylist = this._DeletePaylist.bind(this)
    this._GetData = this._GetData.bind(this)
    this._AddBalance = this._AddBalance.bind(this)
    this._GetDataUser = this._GetDataUser.bind(this)
    this.BalanceLess = this.BalanceLess.bind(this)
  }

  _onMore = () => {
    //Props to open/close the drawer
    this.props.navigation.dispatch(DrawerActions.openDrawer())
  }

  static navigationOptions = ({ navigation }) => {
    let params = navigation.state.params
    return {
      headerStyle: {
        backgroundColor: "#8CAD81",
        shadowColor:'transparent', 
        elevation:0,
        // borderBottomWidth:0.5,
        // borderBottomColor: '#70706e'
      },
      headerRight: (
        <Appbar.Action
          icon="menu"
          color="white"
          onPress={() => params.showMore()}
        ></Appbar.Action>
      )
    }
  }
  componentDidMount() {
    //this.tes()
    let { navigation } = this.props
    this.focusListener = navigation.addListener("didFocus", () => {
      setTimeout(() => {
        this._GetData()
        this._GetDataUser()
      }, 1000)
      this.BalanceLess()
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
    this.props.navigation.setParams({ showMore: this._onMore.bind(this) }) 
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
    }, 800)
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
              this._GetDataUser()
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
              this.props.store.data.map(item=>{
                if (item.balance > 0){
                  alert("Your data has been move to report as PAID Paylist")
                } else {
                  alert("Insufficient Balance")
                }
              })
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
  BalanceLess(){
    this.props.store.data.map((item)=>{
      if (item.balance < 0){
        alert('your balance is minus, add your balance')
      }
    })
  }
  Capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
    }
  render() {
    if (this.props.store.loadingHome){
      return (
        <View style={{flex:1, paddingTop:10}}>
          <ActivityIndicator color='black' />
          </View>
      )                                                           
    } 
    let { checked } = this.state
    let unpaid = <Text style={{color:'#ccbc58'}}>UNPAID</Text>
    let message
    let group = this.props.store.paylist.filter(({completed})=> completed === false)
    .reduce((r, a) => {
      r[new Date(a.CreatedAt).toDateString()] = [...r[new Date(a.CreatedAt).toDateString()] || [], a]
      return r
     }, {})
    return (
    <Provider>
        <View style={styles.container}>
            <Card style={{shadowColor:'transparent',elevation:0, backgroundColor:'#8CAD81', borderRadius:0}}>
              <View style={{flexDirection:'row'}}>
            <Text style={{color:'white', fontSize:24}}> Hi, </Text>
            <Text style={{fontSize:24,color:'white',fontWeight:'700'}}>
                  {
                  this.props.store.data.map(data=>{
                    return(this.Capitalize(data.name))
                    })
                  }
                </Text></View>
              <Card style={{backgroundColor:'#8CAD81',shadowColor:'transparent',elevation:0}}>
                <Card.Content style={styles.card}>
                  <Text style={styles.textNumber}>
                    Your Balance : </Text>
                    <Text style={styles.text}>{this.currencyFormat(
                      this.props.store.data.map(item=> {
                        return (item.balance)
                      })
                    )}
                  </Text>
                </Card.Content>
                </Card>
                <Card style={{backgroundColor:'#8CAD81'}}>
                <Card.Content style={styles.card1}>
                  <Text style={styles.textNumber}>
                    Total Expense : </Text>
                    <Text style={styles.text}>
                    {this.currencyFormat(
                    this.props.store.paylist.filter(({completed})=> completed === false)
                    .reduce(
                    (sum, i) => (total = sum + i.amount),0
                      )
                    )}
                  </Text>
                </Card.Content>
                </Card>
            </Card>
            {
            this.props.store.paylist.filter(({completed})=> completed === false) == "" ? <View style={{paddingTop:25,backgroundColor:'transparent', alignItems:'center',backfaceVisibility:'visible'}}>
            <IconButton style={{width:50, height:50}} icon="playlist-add" color='gray' size={50}></IconButton>
            <Text style={{fontSize:16,color:'gray'}}>Opps! You have no paylist</Text>
            <Text style={{fontSize:16,color:'gray'}}>Go and make one!</Text>
          </View> : <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={this.props.store.loadingHome}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
        >{Object.keys(group).map((i, val)=>{
          return (
          <View key={val}>
            <Text style={{color:'#fefefe', flex:1, left:10, marginBottom:5, marginTop:5}}>{i}</Text>
            {group[i].map((k,item)=>{
              if (k.completed == false && k.DueDate != '0001-01-01T00:00:00Z') {
               let due_date = new Date(k.DueDate)
               if (k.completed == false) {
                 checked = false
                 message = unpaid
               }
               return (
                 <View key={item}>
                 <Card key={item} style={styles.Item}>
                   <List.Accordion style={{backgroundColor:'#f2f2f0'}}
                     titleStyle={{ color: "#8CAD81" }}
                     title={k.name}
                     left={props => <List.Icon {...props} icon="monetization-on" color='#8CAD81'/>}
                   >
                     <View style={{flexDirection:'row', alignItems:'center', right:50}}>
                     <Checkbox
                         status={checked ? "checked" : "unchecked"}
                         color="#8CAD81"
                         uncheckedColor="#ccbc58"
                         onPress={this.ConfirmCheck.bind(this, k.ID)}
                       />{message}
                     <List.Item
                       titleStyle={{color: "rgba(0,0,0,0.7)", fontSize:20, fontWeight:'bold',alignSelf:'flex-end' }}
                       style={{flex:1}}
                       title={this.currencyFormat(k.amount)}
                     /></View>
                     <View style={{flexDirection:'row', alignItems:'center', right:45}}>
                     <Text style={{fontSize:17, fontWeight:'300', color:'#6e6e6e',alignSelf:'center'}}>Due Date :</Text>
                     <List.Item
                       titleStyle={{ color: "black" }}
                       style={{flex:1}}
                       title={due_date.toDateString()}
                     /></View>
                     <Card.Actions style={{ flex:1, alignSelf:'flex-end' }}>
                       <Button
                         color='rgba(255, 16, 0,0.8)'
                         onPress={this.Confirm.bind(this, k.ID)}
                         icon="delete"
                       >
                         Delete
                       </Button>
                       <Button
                         color="black"
                         icon="edit"
                         onPress={() =>
                           this.props.navigation.navigate("UpdatePaylist", {
                             id: k.ID,
                             name: JSON.stringify(k.name),
                             amount: JSON.stringify(k.amount),
                             due_date: JSON.stringify(due_date)
                           })
                         }
                       >
                         edit
                       </Button>
                     </Card.Actions>
                   </List.Accordion>
                 </Card></View>
               )
              }  else if (k.completed == false && k.DueDate == '0001-01-01T00:00:00Z'){
               let unpaid = <Text style={{color:'#ccbc58'}}>UNPAID</Text>
               let message
               if (k.completed == false) {
                 checked = false
                 message = unpaid
               }
               return (
                 <View key={item}>
                 <Card key={item} style={styles.Item}>
                   <List.Accordion style={{backgroundColor:'#f2f2f0'}}
                     titleStyle={{ color: "#8CAD81" }}
                     title={k.name}
                     left={props => <List.Icon {...props} icon="monetization-on" color='#8CAD81'/>}
                   >
                     <View style={{flexDirection:'row', right:50, alignItems:'center'}}>
                     <Checkbox
                         status={checked ? "checked" : "unchecked"}
                         color="#8CAD81"
                         uncheckedColor="#ccbc58"
                         onPress={this.ConfirmCheck.bind(this, k.ID)}
                       />{message}
                     <List.Item
                       titleStyle={{color: 'rgba(0,0,0,0.7)', fontSize:20, fontWeight:'bold',alignSelf:'flex-end'}}
                       style={{flex:1}}
                       title={this.currencyFormat(k.amount)}
                     /></View>
                     <View style={{flexDirection:'row', right:45}}>
                     <Text style={{fontSize:17, fontWeight:'300', color:'#6e6e6e',alignSelf:'center'}}>Due Date :</Text>
                     <List.Item
                       titleStyle={{ color: "black" }}
                       style={{flex:1}}
                       title={'-'}
                     /></View>
                     <Card.Actions style={{ flex:1, alignSelf:'flex-end' }}>
                       <Button
                         color="rgba(255, 16, 0,0.8)"
                         onPress={this.Confirm.bind(this, k.ID)}
                         icon="delete"
                       >
                         Delete
                       </Button>
                       <Button
                         color="black"
                         icon="edit"
                         onPress={() =>
                           this.props.navigation.navigate("UpdatePaylist", {
                             id: k.ID,
                             name: JSON.stringify(k.name),
                             amount: JSON.stringify(k.amount),
                             due_date: JSON.stringify('')
                           })
                         }
                       >
                         edit
                       </Button>
                     </Card.Actions>
                   </List.Accordion>
                 </Card></View>
               )
             } 
           })
           }
          </View>)
        })}
         </ScrollView>
          }
          
          <Modal visible={this.state.isLoad} animationType="slide" animated={true} transparent={true} >
            <View style={{flex:1, width:width/1.4, alignSelf:'center', justifyContent:'center'}}>
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
                  color: "#333333",
                  icon: "attach-money",
                  label: "Add Balance",
                  onPress: () => this.LoadState()
                },
                {
                  style: { backgroundColor: "#F9E48A" },
                  color: "#333333",
                  icon: "playlist-add",
                  label: "Create Paylist",
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

// HomeScreen.navigationOptions = {
//   //title: "HOME",
//   //headerTintColor: '#fff',
//   headerStyle: {
//     backgroundColor: "#8CAD81",
//     shadowColor:'transparent', 
//     //elevation:0,
//     // borderBottomWidth:0.5,
//     // borderBottomColor: '#70706e'
//   }
// }
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
    width:width-10,
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
      width:width/3,
      margin:5
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
    },
    card:{
      justifyContent:'center',
      backgroundColor:'#fefefe',
      marginTop:6, 
      marginBottom:3,
      width:width/1.2,
      alignSelf:'center',
      borderRadius:8,
      flexDirection:'row',
    },
    card1:{
      justifyContent:'center',
      backgroundColor:'#fefefe',
      marginTop:3, 
      marginBottom:6,
      width:width/1.2,
      alignSelf:'center',
      borderRadius:8,
      flexDirection:'row'
    },
    textNumber:{
      alignItems:'center',
      fontWeight: "700", 
      fontSize: 16,
    },
    text:{
      fontSize:17,
      color:'rgba(0,0,0,0.7)',
      fontWeight:'700',
    }
})
