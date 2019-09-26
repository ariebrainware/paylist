import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from 'react-native';

import { MonoText } from '../components/StyledText';
import deviceStorage from '../service/deviceStorage';

export default class HomeScreen extends React.Component{
  constructor(){
    super()
    this.state = {
      dataP:[],
      Loading:true
  };
  }

  _itemComponent=({item})=>{
    return(
        <View style={{flex:1,flexDirection: 'row',marginLeft: 10,}} >
            <View style={{height:50,justifyContent: 'center',}}>
                {/* <Image source={{uri: item.picture.thumbnail }} 
                style={{width:40,height:40,borderRadius: 25,}}
                /> */}
            </View>

            <View style={{flex:2,height:50}}>
                <Text style={{padding:5}} >{item.paylist.name}</Text>
                <Text style={{ padding: 5 }}>{item.paylist.amount}</Text>
            </View>
        </View>
    ) 
}
componentDidMount = () => {
  this._GetData()
}
  async _GetData(){
    var DEMO_TOKEN = await deviceStorage.loadJWT("token");
    console.log(DEMO_TOKEN)
    fetch('http://192.168.100.26:8000/v1/paylist/paylist', {
        method: 'GET',
        headers: {
        'Authorization': DEMO_TOKEN
        }
       })
      .then(resJson => {
        console.log(resJson)
        this.setState({
          Loading:false,
          dataP: resJson.paylist
        });
      })
  }

  render(){
  return (
    
    <View style={styles.container}>
    
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
      </ScrollView>
      <View>
      <FlatList
       data={this.state.dataP}
       renderItem={this._itemComponent}>
    </FlatList>
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
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
    //backgroundColor:'black'
  },
});
