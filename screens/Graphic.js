import React, { Component } from "react"
import { View, Text, Dimensions, StyleSheet, Picker, ScrollView} from "react-native"
import { LineChart, BarChart } from "react-native-chart-kit"
import { observer, inject } from "mobx-react"
import { ActivityIndicator, Card } from "react-native-paper"
import {Svg} from 'react-native-svg'

let width = Dimensions.get('window').width
let height = Dimensions.get('window').height


@inject("store")
@observer
export default class Graphic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      min:0,
      max:0,
      tahun:[],
      value:'',
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
    this.GetYear()
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
        ]
      })
      }, 500)     
    })
    this.setState({loading: false}) 
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
  Jan() {
    this.setState({
      jan : this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 0 && new Date(CreatedAt).getFullYear == this.state.value && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0),
   })
  }

  Feb() {
    this.setState({
      feb : this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 1 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)
   })
  }

  Mar() {
    this.setState({
     mar : this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 2 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)
   })
  }

  Apr() {
    this.setState({
      apr : this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 3 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)
   })
  }

  May() {
    this.setState({
      may : this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 4 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0),
   
   })
  }

  June() {
    this.setState({
      jun : this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 5 &&  completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)
   })
  }

  July() {
    this.setState({
     jul: this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 6 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)
   })
  }

  Aug() {
    this.setState({
      aug : this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 7 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)
   })
  }

  Sep() {
    this.setState({
      sep : this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 8 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)
   })
  }

  Oct() {
    this.setState({
      oct : this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 9 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)
   })
  }

  Nov() {
    this.setState({
      nov : this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 10 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)
   })
  }

  Dec() {
    this.setState({
    dec : this.props.store.paylist.filter(({ CreatedAt, completed }) => new Date(CreatedAt).getMonth() === 11 && completed === true)
    .reduce((sum, i) => (total = sum + i.amount), 0)
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
        <Svg>
        <BarChart
          data={{
            labels: ["Jan","Feb", "Mar","Apr", "May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
            datasets: [
              {
                data: this.state.data,
              }
            ]
          }} horizontalLabelRotation={-60} verticalLabelRotation={20}
          width={width * 4 / 4.4} // from react-native
          height={height / 2} 
          
          yAxisLabel="Rp"
          //yAxisSuffix="k"
          chartConfig={{
            //backgroundColor: "white",
            backgroundGradientFrom: "rgb(140, 173, 129)",
            backgroundGradientFromOpacity:1,
            backgroundGradientTo: "white",
            backgroundGradientToOpacity:0,
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(235, 232, 52,${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 0,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "12",
              stroke: "#ffa726"
            }
          }}
          bezier
          style={{
            marginVertical: 20,
            borderRadius: 0,
          }}
          fromZero={true}
          
        />
        </Svg>
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
