import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import Config from '../config';
import { MonoText } from '../components/StyledText';
import deviceStorage from '../service/deviceStorage';
import { List, Card, Checkbox, Button, ActivityIndicator} from 'react-native-paper';
import { AppLoading } from 'expo';

export default class HomeScreen extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      paylist :[],
      loading: true,
      checked: false
    };
    this._DeletePaylist = this._DeletePaylist.bind(this);
    this._GetData = this._GetData.bind(this);
  }

componentDidMount(){
  this._GetData()
}
 async _GetData(){
    var DEMO_TOKEN = await deviceStorage.loadJWT("token");
    console.log(DEMO_TOKEN)
    const header= {
      'Authorization': DEMO_TOKEN
    };
    fetch(`${Config.PaylistApiURL}/paylist/paylist`, {
        method: 'GET',
        headers: header
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
              loading:false,
              paylist: json
            });
          break
        }      
    })
    .catch((error) => {
      console.log(error)
    })
  }

  async _DeletePaylist(id){
    var DEMO_TOKEN = await deviceStorage.loadJWT("token");
    console.log(" demo "+ DEMO_TOKEN)
    const header = {
      'Authorization' : DEMO_TOKEN
    }
    fetch(`${Config.PaylistApiURL}/paylist/paylist/` + id, {
        method: 'DELETE',
        headers: header
      })
      .then(res => {
        resStatus = res.status
        return res.json()
      })
      .then(res => {
       console.log(res)
       switch (resStatus) {
         case 200:
           console.log('success')
           alert('Delete Success.');
           break
         case 404:
           console.log('no paylist found')
           alert('no paylist found')
           break
        case 400:
          console.log('specify paylist id')
          alert('specify paylist id')
           break
        case 500:
           alert('token expired')
           this.props.navigation.navigate('Login')
           break
         default:
           console.log('unhandled')
           alert('Something wrong, please try again later!')
           break
       }
     })
     .catch(err => {
       console.error(err)
     })
     .done()
    }

    componentWillMount() {
    }

    async _UpdatePaylistStatus(id){
      var DEMO_TOKEN = await deviceStorage.loadJWT("token");
      console.log(" demo "+ DEMO_TOKEN)
      const header = {
        'Authorization' : DEMO_TOKEN
      }
      fetch(`${Config.PaylistApiURL}/paylist/status/`+id, {
          method: 'PUT',
          headers: header
        })
        .then(res => {
          resStatus = res.status
          return res.json()
        })
        .then(res => {
          console.log(res.data)
          this.setState({ 
            checked: checked
        })
    })
  }
    
    onRefresh() {
      this.setState({
        paylist:[]
      });
      this._GetData();
    }

  render(){
    if (this.state.loading) {
      return(
          <View style={{padding:20}}>
                <ActivityIndicator/>
            </View>
        )
    }
    const { checked } = this.state;
    console.log(this.state)
    let pay = this.state.paylist.map((item) => {
      return <Card key={item.ID} style={styles.Item}>
        <Card style={styles.content}>
        <List.Accordion
          title={item.name}
          left={props => <List.Icon {...props} icon="monetization-on" />}>

          <List.Item style={{right: 50}} title={item.amount}/>
          <List.Item style={{right: 50}} title={JSON.stringify(item.completed)}/>
          <Card.Actions style={{right:50}}>
            <Button onPress={ () => this._DeletePaylist(item.ID)} icon="delete">delete</Button>
            <Button icon="edit" onPress={() =>  this.props.navigation.navigate('UpdatePaylist',{
                id : item.ID,
                name: JSON.stringify(item.name),
                amount: JSON.stringify(item.amount)
              })}>edit</Button>
            <Checkbox/>
          </Card.Actions>
        </List.Accordion>
        </Card>
        </Card>    
    })

    return (
      <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}  refreshControl={
          <RefreshControl
            //refresh control used for the Pull to Refresh
            refreshing={this.state.loading}
            onRefresh={this.onRefresh.bind(this)}
          />
        }>{pay}
      </ScrollView>
     
      <View style={styles.tabBarInfoContainer}>
      <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.props.navigation.navigate('CreatePaylist')}
          style={styles.TouchableOpacityStyle}>
          <Image
            source={
             require ('../assets/images/Add-butt.png')
            }
            style={styles.FloatingButtonStyle}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
 }
}

HomeScreen.navigationOptions = {
  title: 'Home',
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#74e1f2',
  },
  contentContainer: {
    paddingTop:10,
  },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  },
  Item: {
    //alignItems:'center',
    margin:1.5,
    padding:3.5
    //justifyContent:'center',
    //borderBottomWidth:1,
    //borderBottomColor: '#eee'
  },
  content: {
    backgroundColor: '#fff',
    margin: 0.5,
  }
});
