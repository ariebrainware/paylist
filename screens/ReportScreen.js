import React,{Component} from 'react'
import {
View, Text, FlatList, Alert, StyleSheet, Platform
} from 'react-native'
import { Card, Title } from 'react-native-paper'
import { inject, observer } from 'mobx-react'
import { heightPercentageToDP } from 'react-native-responsive-screen'

@inject('store') @observer
export default class ReportScreen extends React.Component{
    constructor(props)
    {
      super(props)
      this.state = { GridViewItems: [
        {id: 0, key: 'January'},
        {id: 1,key: 'February'},
        {id: 2,key: 'March'},
        {id: 3,key: 'April'},
        {id: 4,key: 'May'},
        {id: 5,key: 'June'},
        {id: 6,key: 'July'},
        {id: 7,key: 'August'},
        {id: 8,key: 'September'},
        {id: 9,key: 'October'},
        {id: 10,key: 'November'},
        {id: 11,key: 'December'},
      ]}
    }
    
GetGridViewItem (item) {
 Alert.alert(item)
}

  render() {
    return (
    <View style={styles.MainContainer}>
        <Card.Content style={{backgroundColor:"#2e2d2d",alignSelf:'center', borderBottomWidth:0.5, borderBottomColor:'#8CAD81'}}>
            <Title style={{fontSize:14,color:'white', marginBottom:7, marginTop:3}}>Check Your Monthly Pay-List Report Here</Title>
        </Card.Content>
        <FlatList style={{paddingTop:13}}
         data={ this.state.GridViewItems }
         renderItem={({item}) =><View style={styles.GridViewBlockStyle}>
            <Text style={styles.GridViewInsideTextItemStyle} onPress={ () => this.props.navigation.navigate('ReportDetail', {id : item.id})} > {item.key} </Text>   
        </View>}
            numColumns={3}/>
    </View>        
      )
    }
}

ReportScreen.navigationOptions = {
  title: "Report",
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
   MainContainer :{
    justifyContent: 'center',
    flex:1,
    backgroundColor:"#2e2d2d"
   },
   GridViewBlockStyle: {
     justifyContent: 'center',
     flex:1,
     alignItems: 'center',
     height:heightPercentageToDP('17%'),
     margin: 7,
     backgroundColor: '#c9d99e',
     borderRadius:10,
    },    
    GridViewInsideTextItemStyle: {
     color: 'black',
     padding: 10,
     fontSize: 15,
     justifyContent: 'center',
     fontWeight:'200'
    },
})