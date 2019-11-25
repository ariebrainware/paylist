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
        {key: 'January'},
        {key: 'February'},
        {key: 'March'},
        {key: 'April'},
        {key: 'May'},
        {key: 'June'},
        {key: 'July'},
        {key: 'August'},
        {key: 'September'},
        {key: 'October'},
        {key: 'November'},
        {key: 'December'},
      ]}
    }
    
GetGridViewItem (item) {
 Alert.alert(item)
}
    
  render() {
    return (
    <View style={styles.MainContainer}>
        <Card.Content style={{alignItems:'center', backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:'#319e4c'}}>
            <Title>Paylist Report</Title>
        </Card.Content>
        <FlatList
         data={ this.state.GridViewItems }
         renderItem={({item}) =><View style={styles.GridViewBlockStyle}>
            <Text style={styles.GridViewInsideTextItemStyle} onPress={ () => this.props.navigation.navigate('ReportDetail', this.GetGridViewItem.bind(this, item.key))} > {item.key} </Text>   
        </View>}
            numColumns={3}/>
    </View>          
      )
    }
}

ReportScreen.navigationOptions = {
    title: 'Report',
    headerStyle: {
      backgroundColor: '#a9b0ae'
    }
}
let styles = StyleSheet.create({ 
   MainContainer :{
    justifyContent: 'center',
    flex:1,
    margin: 15,
   },
   GridViewBlockStyle: {
     justifyContent: 'center',
     flex:1,
     alignItems: 'center',
     height:heightPercentageToDP('17%'),
     margin: 5,
     backgroundColor: '#c9d99e',
     borderRadius:10
    },    
    GridViewInsideTextItemStyle: {
     color: 'black',
     padding: 10,
     fontSize: 15,
     justifyContent: 'center',
     fontWeight:'200'
    },
})