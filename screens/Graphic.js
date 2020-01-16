import React, { Component } from "react"
import { View, Text, Dimensions, StyleSheet, Picker} from "react-native"
import { LineChart } from "react-native-chart-kit"
import { observer, inject } from "mobx-react"
import { ActivityIndicator, Card } from "react-native-paper"
import {showMessage} from 'react-native-flash-message'

@inject("store")
@observer
export default class Graphic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      tahun:[],
      pilih:'',
      jan:0,
      feb:0,
      mar:0,
      apr:0,
      may:0,
      jun:0,
      jul:0,
      aug:0,
      sep:0,
      oct:0,
      nov:0,
      dec:0,
      loading:true
    }
    this.Jan = this.Jan.bind(this)
    this.Feb = this.Feb.bind(this)
    this.Mar = this.Mar.bind(this)
    this.Apr =this.Apr.bind(this)
    this.May = this.May.bind(this)
    this.June = this.June.bind(this)
    this.July = this.July.bind(this)
    this.Aug = this.Aug.bind(this)
    this.Sep = this.Sep.bind(this)
    this.Oct =this.Oct.bind(this)
    this.Nov = this.Nov.bind(this)
    this.Dec = this.Dec.bind(this)
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
    this.setState({data:[]})
  }

  componentDidMount(){
    let { navigation } = this.props
    this.focusListener = navigation.addListener("didFocus", () => {
      this.Jan()
      this.Feb()
      this.Mar()
      this.Apr()
      this.May()
      this.June()
      this.July()
      this.Aug()
      this.Sep()
      this.Oct()
      this.Nov()
      this.Dec()
      setTimeout(()=>{
        this.setState({
          data : [
            this.state.jan, 
            this.state.feb, 
            this.state.mar,
            this.state.apr,
            this.state.may,
            this.state.jun,
            this.state.jul,
            this.state.aug,
            this.state.sep,
            this.state.oct,
            this.state.nov,
            this.state.dec
        ]})
        this.setState({loading: false})
      }, 1000)     
  }) 
  }
  
  Jan() {
    this.setState({
      jan : this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 0 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)
   })
  }

  Feb() {
    this.setState({
      feb : this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 9 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)
   })
  }

  Mar() {
    this.setState({
     mar : [this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 2 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)]
   })
  }

  Apr() {
    this.setState({
      apr : [this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 3 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)]
   })
  }

  May() {
    this.setState({
      may : [this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 4 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)]
   })
  }

  June() {
    this.setState({
      jun : [this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 5 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)]
   })
  }

  July() {
    this.setState({
     jul: [this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 6 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)]
   })
  }

  Aug() {
    this.setState({
      aug : [this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 7 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)]
   })
  }

  Sep() {
    this.setState({
      sep : [this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 8 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)]
   })
  }

  Oct() {
    this.setState({
      oct : [this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 9 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)]
   })
  }

  Nov() {
    this.setState({
      nov : [this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 10 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)]
   })
  }

  Dec() {
    this.setState({
    dec : [this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 11 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)]
   })
  }

  tes(){
    let data = this.props.store.paylist.filter((val,id,array)=>{
      return array.indexOf(val)==id
    })
  }
  render() {
    if (this.state.loading){
      return (
        <View>
          <ActivityIndicator size="small" color='black' style={{padding: 20 }} />
        </View>
      )
    }
    
    return (
      <View style={styles.container}>
        <LineChart
          data={{
            labels: ["Jan","Feb", "Mar","Apr", "May","June","Jul","Aug","Sep","Oct","Nov","Dec"],
            datasets: [
              {
                data: this.state.data
              }
            ]
          }} horizontalLabelRotation={-55}
          width={Dimensions.get("window").width} // from react-native
          height={Dimensions.get("window").height / 2}
          yAxisLabel="Rp"
          //yAxisSuffix="k"
          chartConfig={{
            backgroundColor: "transparent",
            backgroundGradientFrom: "transparent",
            backgroundGradientTo: "transparent",
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => "#8CAD81",
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 15
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          }}
          onDataPointClick={({ value, getColor }) =>
                  showMessage({
                    message: `${value}`,
                    description: "You selected this value",
                    backgroundColor: getColor(0.9)
                  })
                }
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
          fromZero={true}
        />
        <Card style={{ backgroundColor: "#2e2d2d",shadowColor:'transparent',elevation:0}}>
              <Card.Content
                style={{ backgroundColor: "#2e2d2d", alignSelf:'center' }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 15, color:'#8CAD81'}}>
                  Total Expense :
                  {this.currencyFormat(
                  this.props.store.paylist.filter(({completed})=> completed === true)
                  .reduce(
                    (sum, i) => (total = sum + i.amount),0
                  )
                  )}
                </Text>
              </Card.Content>
            </Card>
      </View>
    )
  }
}

Graphic.navigationOptions = {
  title: "Line Chart",
  headerTintColor: "#fff",
  headerStyle: {
    backgroundColor: "#2e2d2d",
    shadowColor: "transparent",
    elevation: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: "#70706e"
  }
}
let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2e2d2d",
    justifyContent: "center"
  }
})
