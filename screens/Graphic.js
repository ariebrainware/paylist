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
import {BarChart } from "react-native-chart-kit"
import { observer, inject } from "mobx-react"
import { ActivityIndicator, Card } from "react-native-paper"
import { Svg } from "react-native-svg"

let width = Dimensions.get("window").width
let height = Dimensions.get("window").height

@inject("store")
@observer
export default class Graphic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
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
    this.focusListener = navigation.addListener("didFocus", () => {
      setTimeout(() => {
        this.GetYear()
      }, 200)
    })
  }

  GetYear() {
    let tes = []
    tes = this.props.store.paylist
    if (this.props.store.paylist.length > 0) {
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
    }, ()=> {
      setTimeout(()=>{
        this.setState({
          loading:false,
          data: [
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
      },1000)
    })
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
        <BarChart
          data={{
            labels: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec"
            ],
            datasets: [
              {
                data: this.state.data
              }
            ]
          }}
          horizontalLabelRotation={-60}
          verticalLabelRotation={20}
          width={800} // from react-native
          height={height / 2}
          yAxisLabel="Rp"
          //yAxisSuffix="k"
          chartConfig={{
            //backgroundColor: "white",
            backgroundGradientFrom: "rgb(140, 173, 129)",
            backgroundGradientFromOpacity: 1,
            backgroundGradientTo: "white",
            backgroundGradientToOpacity: 0,
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(235, 232, 52,${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 0
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
            borderRadius: 0
          }}
          fromZero={true}
        />
      </Svg>
    )
  }
  render() {
    console.log('tes', this.state.value)
    return (
      <View style={styles.container}>
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
          ><View style={{alignSelf:'center'}}>
            <Text style={{fontSize:14, marginBottom:-15,color:'white', alignSelf:'flex-start', fontWeight:'700'}}>Select Year</Text>
            {this.renderPicker()}</View>
            {this.state.value != "" ? <ScrollView horizontal={true}>{this.renderGraph()}</ScrollView> : null}
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
  title: "BAR CHART",
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
