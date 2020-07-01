import React,{Component} from 'react'
import {
View, Text, FlatList, Alert, StyleSheet, Picker, Dimensions, ScrollView, Image
} from 'react-native'
import { Card, Title,IconButton } from 'react-native-paper'
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
  let { navigation } = this.props
    this.focusListener = navigation.addListener("willFocus", () => {
      setTimeout(() => {
        this.GetYear()
      }, 200)
    })
}
componentWillUnmount() {
  this.focusListener.remove()
}

  GetYear(){
    let tes = []
    tes = this.props.store.paylist
    if(this.props.store.paylist.length > 0){
    let min = new Date(tes[0].CreatedAt).getFullYear()
    let max = new Date (tes[tes.length-1].CreatedAt).getFullYear()
    this.setState({
      min : min,
      max: max
    })
    for(let i=min; i<= max;i++){
      var index = this.state.tahun.findIndex(x => x == i)
      if (index === -1) {
        this.state.tahun.push(i)
      }else {
        console.log("object already exists")
      }
    }
  } else {
    this.setState({tahun:[]})
  }
  }

  render() {
    return (
    <View style={styles.MainContainer}>
      {
       this.props.store.paylist.filter(({completed})=> completed == true) == "" ? 
       (
        <View style={{paddingTop:25,alignItems:'center'}}>
          <Image style={{width:60, height:60}} source={require('../assets/images/icon-list.png')} size={50}/>
          <Text style={{fontSize:16,color:'gray'}}>This Report Will Show After You Create Paid Paylist</Text>
          <Text style={{fontSize:16,color:'gray'}}>Go and make one!</Text>
        </View>
        ) : (
          <Card style={{backgroundColor:'#2e2d2d',shadowColor:'transparent',elevation:0, marginBottom:20}}>
            <Card.Content style={{backgroundColor:"#2e2d2d",alignSelf:'center', borderBottomWidth:0.5, borderBottomColor:'#8CAD81'}}>
              <Title style={{fontSize:14,color:'white', marginBottom:7, marginTop:3}}>Check Your Monthly Pay-List Report Here</Title>
              </Card.Content>
            <View style={{backgroundColor:'#2e2d2d', width:width * 3 /4,marginTop:10, alignSelf:'center'}}>
              <Text style={{marginBottom:-7,fontSize:14, color:'white', alignSelf:'flex-start', fontWeight:'700'}}>Select Year</Text>
              <Picker
                selectedValue={this.state.value} 
                style={{color:'#fefe', marginBottom:10}}
                onValueChange={(val) => this.setState({value:val})}
              >
                {
                  this.state.tahun.map((val,i)=>{
                    return( <Picker.Item key={i} color='black' label={String(val)} value={val} />)
                  })
                }
              </Picker>
            </View>
     
        <FlatList style={{}} contentContainerStyle={{paddingBottom:10}}
         data={ this.state.GridViewItems }
         renderItem={({item}) =><View style={styles.GridViewBlockStyle}>
            <Text style={styles.GridViewInsideTextItemStyle} onPress={() => this.props.navigation.navigate('ReportDetail', {
              year: this.state.value,
              month: item.id
            })
              }> {item.key} </Text>   
        </View>}
            numColumns={3}/></Card>)
            }
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
     height:height / 7,
     margin: 8,
     backgroundColor: '#8CAD81',
     borderRadius:10,
    },    
    GridViewInsideTextItemStyle: {
     color: 'rgba(255,255,255,0.8)',
     padding: 10,
     fontSize: 15,
     justifyContent: 'center',
     fontWeight:'200',
    },
})