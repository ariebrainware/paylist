import React, { Component } from "react"
import {
  ScrollView,
  View,
  StyleSheet,
  BackHandler,
  Text,
  TouchableOpacity,
  Dimensions
} from "react-native"
import { Card, Appbar, Menu, Divider, Button, List } from "react-native-paper"
import { inject, observer } from "mobx-react"
import { PieChart } from "react-native-chart-kit"
import { widthPercentageToDP } from "react-native-responsive-screen"

// const data = [
//   {
//     name: "Seoul",
//     population: 2150000,
//     color: "rgba(131, 167, 234, 1)",
//     legendFontColor: "#7F7F7F",
//     legendFontSize: 12
//   },
//   {
//     name: "Toronto",
//     population: 2800000,
//     color: "gray",
//     legendFontColor: "#7F7F7F",
//     legendFontSize: 12
//   },
//   {
//     name: "Beijing",
//     population: 5276120,
//     color: "red",
//     legendFontColor: "#7F7F7F",
//     legendFontSize: 12
//   },
// ]

// const chartConfig = {
//     backgroundGradientFrom: "#1E2923",
//     backgroundGradientFromOpacity: 0,
//     backgroundGradientTo: "#08130D",
//     backgroundGradientToOpacity: 0.5,
//     color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
//     strokeWidth: 2, // optional, default 3
//     barPercentage: 0.5
//   }

//   let width = Dimensions.get('window').width
//   let height = Dimensions.get('window').height

@inject("store")
@observer
export default class ReportDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      tes: []
    }
    this.onBackButtonPressed = this.onBackButtonPressed.bind(this)
    this._handleMore = this._handleMore.bind(this)
  }
  _handleMore() {
    <Menu
      visible={this.state.visible}
      onDismiss={this._closeMenu}
      anchor={<Button onPress={this._openMenu}>Show menu</Button>}
    >
      <Menu.Item onPress={() => {}} title="Item 1" />
      <Menu.Item onPress={() => {}} title="Item 2" />
      <Divider />
      <Menu.Item onPress={() => {}} title="Item 3" />
    </Menu>
  }
  static navigationOptions = ({ navigation }) => {
    let params = navigation.state.params
    return {
      headerRight: (
        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            right: 5
          }}
          onPress={() => params.showMore()}
        >
          <Appbar.Action color='#8CAD81' icon="more-vert" />
        </TouchableOpacity>
      )
    }
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
    this.props.navigation.setParams({ showMore: this._handleMore })
    let { navigation } = this.props
    this.props.store.paylist.map(item => {
      let tgl = new Date(item.CreatedAt)
      if (tgl.getMonth() === navigation.getParam("id", "") && item.completed === true) {
        this.state.tes.push({ID: item.ID, name:item.name, amount: item.amount, CreatedAt: item.CreatedAt})
      }
    })
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackButtonPressed)
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.onBackButtonPressed
    )
  }
  onBackButtonPressed() {
    this.props.navigation.navigate("Main")
    return true
  }

  render() {
    let data = this.state.tes.map((val,i) => {
    let tgl = new Date(val.CreatedAt)
    return (<Card key={i} style={styles.Item}>
          <List.Accordion
            titleStyle={{ color: "black" }}
            title={tgl.toDateString()}
            left={props => <List.Icon {...props} icon="monetization-on" />}
          >
            <View style={{flexDirection:'row', alignItems:'center', right:40}}>
            <Text style={{fontSize:17}}>Name : </Text>
            <List.Item
              titleStyle={{ color: "black" }}
              style={{flex:1 }}
              title={val.name}
            /></View>
            <List.Item titleStyle={{fontWeight:'bold'}}
              style={{ right: 50}}
              title={this.currencyFormat(val.amount)}
            />
          </List.Accordion>
        </Card>
        )
      })    
    return (
      <View style={styles.container}>
        <View>
            <Card style={{ backgroundColor: "#2e2d2d",shadowColor:'transparent',elevation:0}}>
              <Card.Content
                style={{ backgroundColor: "#2e2d2d", alignSelf:'center' }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 15, color:'#8CAD81'}}>
                  Total Expense :
                  {this.currencyFormat(
                    this.state.tes.reduce(
                      (sum, i) => (total = sum + i.amount),
                      0
                    )
                  )}
                </Text>
              </Card.Content>
            </Card>
          </View>
        <ScrollView>
          {/* <PieChart
            data={data}
            width={width}
            height={height/2}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="65"
            absolute={false}
          /> */}
          {data}
        </ScrollView>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2e2d2d"
  },
  Item: {
    width: widthPercentageToDP("96%"),
    flex:2,
    alignSelf:'center',
    margin: 1.5,
    padding: 3.5,
    backgroundColor:'#f2f2f0',
    justifyContent:'center'
  },
})
