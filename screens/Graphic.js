import React, { Component } from "react"
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Picker,
  ScrollView,
  Button
} from "react-native"
import {LineChart } from "react-native-chart-kit"
import { observer, inject } from "mobx-react"
import FlashMessage, {showMessage, hideMessage} from 'react-native-flash-message'
import { ActivityIndicator, Card } from "react-native-paper"
import { Svg } from "react-native-svg"

let width = Dimensions.get("window").width
let height = Dimensions.get("window").height

const data = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
      strokeWidth: 2 // optional
    }
  ],
  legend: ["Rainy Days", "Sunny Days", "Snowy Days"] // optional
};
@inject("store")
@observer
export default class Graphic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      income: [],
      outcome: [],
      min: 0,
      max: 0,
      tahun: [],
      value: 0,
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      janu: 0,
      febu: 0,
      marc: 0,
      apri: 0,
      mayy: 0,
      june: 0,
      july: 0,
      augu: 0,
      sept: 0,
      octo: 0,
      nove: 0,
      dece: 0,
      loading: true
    }
    this.GetData = this.GetData.bind(this)
  }

  currencyFormat(num) {
    return (
      "Rp " +
      parseInt(num)
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    )
  }

  componentDidMount() {
    this.GetYear()
    setTimeout(() => {
      this.setState({ loading: false })
    }, 1500)
    let { navigation } = this.props
    this.focusListener = navigation.addListener("willFocus", () => {
      // this.setState({value: 0})
      setTimeout(() => {
        this.GetYear()
      }, 200)
    })
  }

  GetYear() {
    let tes = []
    tes = this.props.store.paylist
    if (this.props.store.paylist.length > 0 && this.props.store.income.length > 0 ) {
      let min = new Date(tes[0].CreatedAt).getFullYear()
      let max = new Date(tes[tes.length - 1].CreatedAt).getFullYear()
      this.setState({
        min: min,
        max: max
      })
      for (let i = min; i <= max; i++) {
        var index = this.state.tahun.findIndex(x => x == i)
        if (index === -1) {
          this.state.tahun.push(i)
        } else {
          console.log("object already exists")
        }
      }
    } else {
      this.setState({ tahun: [] })
    }
  }

  GetData() {
    if (this.props.store.income.length > 0 && this.props.store.paylist.length > 0) {
      this.setState({
        jan: this.props.store.paylist
          .filter(
            ({ CreatedAt, completed }) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 0 &&
              completed == true
          )
          .reduce((sum, i) => (total = sum + i.amount), 0),
        feb: this.props.store.paylist
          .filter(
            ({ CreatedAt, completed }) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 1 &&
              completed == true
          )
          .reduce((sum, i) => (total = sum + i.amount), 0),
        mar: this.props.store.paylist
          .filter(
            ({ CreatedAt, completed }) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 2 &&
              completed == true
          )
          .reduce((sum, i) => (total = sum + i.amount), 0),
        apr: this.props.store.paylist
          .filter(
            ({ CreatedAt, completed }) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 3 &&
              completed == true
          )
          .reduce((sum, i) => (total = sum + i.amount), 0),
        may: this.props.store.paylist
          .filter(
            ({ CreatedAt, completed }) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 4 &&
              completed == true
          )
          .reduce((sum, i) => (total = sum + i.amount), 0),
        jun: this.props.store.paylist
          .filter(
            ({CreatedAt, completed }) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 5 &&
              completed == true
          )
          .reduce((sum, i) => (total = sum + i.amount), 0),
        jul: this.props.store.paylist
          .filter(
            ({ CreatedAt, completed }) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 6 && completed == true
          )
          .reduce((sum, i) => (total = sum + i.amount), 0),
        aug: this.props.store.paylist
          .filter(
            ({ CreatedAt, completed }) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 7 &&
              completed == true
          )
          .reduce((sum, i) => (total = sum + i.amount), 0),
        sep: this.props.store.paylist
          .filter(
            ({ CreatedAt, completed }) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 8 &&
              completed == true
          )
          .reduce((sum, i) => (total = sum + i.amount), 0),
        oct: this.props.store.paylist
          .filter(
            ({ CreatedAt, completed }) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 9 &&
              completed == true
          )
          .reduce((sum, i) => (total = sum + i.amount), 0),
        nov: this.props.store.paylist
          .filter(
            ({ CreatedAt, completed }) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 10 &&
              completed == true
          )
          .reduce((sum, i) => (total = sum + i.amount), 0),
        dec: this.props.store.paylist
          .filter(
            ({ CreatedAt, completed }) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 11 &&
              completed == true
          )
          .reduce((sum, i) => (total = sum + i.amount), 0),
      })
      this.setState({
        janu: this.props.store.income
          .filter(
            ({ CreatedAt}) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 0
          )
          .reduce((sum, i) => (total = sum + i.Income), 0),
        febu: this.props.store.income
          .filter(
            ({ CreatedAt}) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 1
          )
          .reduce((sum, i) => (total = sum + i.Income), 0),
        marc: this.props.store.income
          .filter(
            ({ CreatedAt}) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 2
          )
          .reduce((sum, i) => (total = sum + i.Income), 0),
        apri: this.props.store.income
          .filter(
            ({ CreatedAt}) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 3
          )
          .reduce((sum, i) => (total = sum + i.Income), 0),
        mayy: this.props.store.income
          .filter(
            ({ CreatedAt}) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 4
          )
          .reduce((sum, i) => (total = sum + i.Income), 0),
        june: this.props.store.income
          .filter(
            ({CreatedAt}) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 5
          )
          .reduce((sum, i) => (total = sum + i.Income), 0),
        july: this.props.store.income
          .filter(
            ({ CreatedAt}) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 6
          )
          .reduce((sum, i) => (total = sum + i.Income), 0),
        augu: this.props.store.income
          .filter(
            ({ CreatedAt}) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 7
          )
          .reduce((sum, i) => (total = sum + i.Income), 0),
        sept: this.props.store.income
          .filter(
            ({ CreatedAt}) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 8
          )
          .reduce((sum, i) => (total = sum + i.Income), 0),
        octo: this.props.store.income
          .filter(
            ({ CreatedAt }) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 9
          )
          .reduce((sum, i) => (total = sum + i.Income), 0),
        nove: this.props.store.income
          .filter(
            ({ CreatedAt}) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 10
          )
          .reduce((sum, i) => (total = sum + i.Income), 0),
        dece: this.props.store.income
          .filter(
            ({ CreatedAt}) =>
              new Date(CreatedAt).getFullYear() == this.state.value &&
              new Date(CreatedAt).getMonth() == 11
          )
          .reduce((sum, i) => (total = sum + i.Income), 0),
      },()=> {
        setTimeout(()=>{
          this.setState({
            loading:false,
            outcome: [
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
            ],
            income: [
              this.state.janu,
              this.state.febu,
              this.state.marc,
              this.state.apri,
              this.state.mayy,
              this.state.june,
              this.state.july,
              this.state.augu,
              this.state.sept,
              this.state.octo,
              this.state.nove,
              this.state.dece
            ]
          })
        },1000)
      })     
    } 
    else {
      setTimeout(() => {
        this.setState({
          loading: false,
          // outcome: [2000000,2500000,3000000,3000000,2400000,3500000,2800000,2950000,3000000,5000000,2500000,2200000],
          // income: [3700000,2800000,2900000,1000000,3500000,4000000,4000000,4250000,4000000,3500000,4000000,4000000]
        })
      },1000)
    }
  }

  renderPicker() {
    return (
      <View
        style={{
          backgroundColor: "#2e2d2d",
          width: (width * 3) / 4,
          marginTop: 13,
          alignSelf: "center"
        }}
      >
        <Picker
          selectedValue={this.state.value}
          style={{color: "#fefe" }}
          onValueChange={val => (this.setState({ value: val, loading:true },()=>this.GetData()))}
        >
          <Picker.Item label='Select' value=""/>
          {this.state.tahun.map((val, i) => {
            return (
              <Picker.Item
                key={i}
                color="black"
                label={String(val)}
                value={val}
              />
            )
          })}
        </Picker>
      </View>
    )
  }
  renderGraph() {
    return (
      <Svg>
        <LineChart
          data={{
            labels: [
              "Jan","Feb", "March","April",
              "May","June","July","Aug",
              "Sep","Oct","Nov","Dec"
            ],
            datasets: [
              {
                data: this.state.outcome,
                color: (opacity = 1) => `rgba(247, 40, 40, ${opacity})`, // optional
                strokeWidth: 4 // optional
              },
              {
                data: this.state.income, 
                color: (opacity = 1) => `rgba(204, 188, 88, ${opacity})`, // optional
                strokeWidth: 4, // optional
                // stroke: 'red'
              },
          ],
          legend: ["Outcome", "Income"] // optional}
        }}
          width={width+200}
          height={height/2}
          fromZero
          // yAxisLabel="Rp"
          // yAxisSuffix="k"
          style={{
            borderRadius: 20,
          }}
          horizontalLabelRotation={-45}
          onDataPointClick={({ value, label, getColor }) =>
          showMessage({
            message: `Rp: ${value}`,
            description: '',
            backgroundColor: getColor(1)
          })
        }
          chartConfig={{
            backgroundColor: "white",
            backgroundGradientFrom: "rgb(140, 173, 129)",
            backgroundGradientFromOpacity: 1,
            backgroundGradientTo: "white",
            barPercentage: 0.5,
            backgroundGradientToOpacity: 0,
            propsForBackgroundLines: {
              strokeDasharray: "4", // solid background lines with no dashes
              strokeWidth: .25,
              stroke: `rgba(0, 0, 0, .50)`,
          },
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(64, 62, 59,${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 14
            },
            propsForDots: {
              r: "9",
              // strokeWidth: "",
              // stroke: "#fff", // dots colors
              color: (opacity = 1) => `rgba(64, 62, 59,${opacity})`,
            }
          }}
          // bezier
        />
      </Svg>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <FlashMessage 
          position='top'
          // hideStatusBar={true}
          floating={true}
          duration={1500}
          style={styles.message}
        />
        {this.state.loading ? (
          <View>
            <ActivityIndicator
              size="small"
              color="white"
              style={{ padding: 20 }}
            />
          </View>
        ) : (
          <Card
            style={{
              backgroundColor: "#2e2d2d",
              shadowColor: "transparent",
              elevation: 0
            }}
          >
          <View style={{alignSelf:'center', zIndex: -1}}>
            <Text style={{fontSize:14, marginBottom:-15,color:'white', alignSelf:'flex-start', fontWeight:'700'}}>Select Year</Text>
            {this.renderPicker()}</View>
            {this.state.value != "" ?
              (
                <ScrollView horizontal={true}>
                  {this.renderGraph()}
                </ScrollView>
              ) 
              : (
                null
                )
              }
              <Card.Content
                style={{ backgroundColor: "#2e2d2d", alignSelf: "center" }}
              >
              <Text
                style={{ fontWeight: "bold", fontSize: 15, color: "#8CAD81" }}
              >
                Total Expense :
                {this.currencyFormat(
                  this.props.store.paylist
                    .filter(
                      ({ completed, CreatedAt }) =>
                        completed == true &&
                        new Date(CreatedAt).getFullYear() === this.state.value
                    )
                    .reduce((sum, i) => (total = sum + i.amount), 0)
                )}
              </Text>
            </Card.Content>
          </Card>
        )}
      </View>
    )
  }
}

Graphic.navigationOptions = {
  title: "LINE CHART",
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
    justifyContent: "center",
    paddingTop: height/8
  },
  message: {
    height: height/6,
    // position: 'absolute',
    // zIndex: 9999999
  }
})
