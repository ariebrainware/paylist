import React,{Component} from 'react'
import {
View, Text, FlatList, Alert, StyleSheet, Picker, Dimensions, ScrollView
} from 'react-native'
import { Card, Title } from 'react-native-paper'
import { inject, observer } from 'mobx-react'
import { heightPercentageToDP } from 'react-native-responsive-screen'

let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
@inject('store') @observer
export default class ReportScreen extends React.Component{
    constructor(props)
    {
      super(props)
      this.state = { 
        min:0,
        max:0,
        tahun:[],
        value:'',
        GridViewItems: [
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
      this.GetYear = this.GetYear.bind(this)
    }

GetGridViewItem (item) {
 Alert.alert(item)
}
componentDidMount(){
  this.GetYear()
}
  GetYear(){
    let tes = this.props.store.paylist
    let min = new Date(tes[0].CreatedAt).getFullYear()
    let max = new Date (tes[tes.length-1].CreatedAt).getFullYear()
    this.setState({
      min : min,
      max: max
    })
    for(let i=min; i<= max;i++){
      this.state.tahun.push(i)
    }
  }

  render() {
    console.log('val', this.state.value)
    return (
    <View style={styles.MainContainer}>
      <Card.Content style={{backgroundColor:"#2e2d2d",alignSelf:'center', borderBottomWidth:0.5, borderBottomColor:'#8CAD81'}}>
            <Title style={{fontSize:14,color:'white', marginBottom:7, marginTop:3}}>Check Your Monthly Pay-List Report Here</Title>
        </Card.Content>
      <View style={{backgroundColor:'#2e2d2d', width:width * 3 /4,marginTop:10, alignSelf:'center'}}>
      <Picker selectedValue={this.state.value} style={{color:'#fefe'}} 
      onValueChange={(val) => this.setState({value:val})}>
        {
          this.state.tahun.map((val,i)=>{
            return( <Picker.Item key={i} color='black' label={String(val)} value={val} />)
          })
        }
      </Picker>
      </View>
        <FlatList style={{paddingTop:13}}
         data={ this.state.GridViewItems }
         renderItem={({item}) =><View style={styles.GridViewBlockStyle}>
            <Text style={styles.GridViewInsideTextItemStyle} onPress={() => this.props.navigation.navigate('ReportDetail', {
              year: this.state.value,
              month: item.id
            })
              }> {item.key} </Text>   
        </View>}
            numColumns={3}/>
    </View>        
      )
    }
}

ReportScreen.navigationOptions = {
  title: "REPORT",
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
     height:height/6.5,
     margin: 7,
     backgroundColor: '#8CAD81',
     borderRadius:10,
    },    
    GridViewInsideTextItemStyle: {
     color: 'rgba(255,255,255,0.8)',
     padding: 10,
     fontSize: 15,
     justifyContent: 'center',
     fontWeight:'200'
    },
})