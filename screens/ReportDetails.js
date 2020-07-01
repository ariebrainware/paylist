import React, { Component } from "react"
import {
  ScrollView,
  View,
  StyleSheet,
  BackHandler,
  Text,
  Dimensions,
} from "react-native"
import { Card, Button, List, Checkbox } from "react-native-paper"
import { inject, observer } from "mobx-react"
import { widthPercentageToDP } from "react-native-responsive-screen"
import { Table, Row } from "react-native-table-component"
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'

const tableHeader = ['Name','Amount','Status','Date Created', 'Due Date']

@inject("store")
@observer
export default class ReportDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      tes: [],
      checked: false,
    }
    this.onBackButtonPressed = this.onBackButtonPressed.bind(this)
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
    //this.props.navigation.setParams({ showMore: this._handleMore })
    let { navigation } = this.props
    this.props.store.paylist.map((item) => {
      let tgl = new Date(item.CreatedAt)
      if (
        tgl.getMonth() == navigation.getParam("month", "") &&
        tgl.getFullYear() == navigation.getParam("year", "") &&
        item.completed === true
      ) {
        this.state.tes.push({
          // ID: item.ID,
          name: item.name,
          amount: item.amount,
          completed: "Paid",
          createdAt: new Date(item.CreatedAt).toDateString(),
          dueDate: item.DueDate.substring(0,4) !== '0001' ? new Date(item.DueDate).toDateString() : '-',
        })
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
    let { checked } = this.state
    let paid = <Text style={{ color: "#8CAD81" }}>PAID</Text>
    let message
    let data = this.state.tes.map((val, i) => {
      if (val.completed == true) {
        checked = true
        message = paid
      }
      let tgl = new Date(val.CreatedAt)
      return (
        <Card key={i} style={styles.Item}>
          <List.Accordion
            titleStyle={{ color: "black" }}
            title={tgl.toDateString()}
            left={(props) => <List.Icon {...props} icon="monetization-on" />}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", right: 40 }}
            >
              <Text style={{ fontSize: 17 }}>Name : </Text>
              <List.Item
                titleStyle={{ color: "rgba(0,0,0,0.7)", fontSize: 20 }}
                style={{ flex: 1 }}
                title={val.name}
              />
            </View>
            <View
              style={{ flexDirection: "row", right: 50, alignItems: "center" }}
            >
              <Checkbox
                status={checked ? "checked" : "unchecked"}
                color="#8CAD81"
                uncheckedColor="#ccbc58"
                //onPress={this.ConfirmCheck.bind(this, val.ID)}
              />
              {message}
              <List.Item
                titleStyle={{
                  color: "rgba(0,0,0,0.7)",
                  fontSize: 20,
                  fontWeight: "bold",
                  alignSelf: "flex-end",
                }}
                style={{ flex: 1 }}
                title={this.currencyFormat(val.amount)}
              />
            </View>
          </List.Accordion>
        </Card>
      )
    })
    return (
      <View style={styles.container}>
        {this.state.tes.length > 0 && (
          <Card
            style={{
              backgroundColor: "#2e2d2d",
              shadowColor: "transparent",
              elevation: 0,
            }}
          >
            <Card.Content
              style={{ backgroundColor: "#2e2d2d", alignSelf: "center" }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 15, color: "#8CAD81" }}
              >
                Total Expense :
                {this.currencyFormat(
                  this.state.tes.reduce((sum, i) => (total = sum + i.amount), 0)
                )}
              </Text>
            </Card.Content>
          </Card>
        )}
        {this.state.tes == "" ? (
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 17, color: "white" }}>
              Opps! You have No Paid Paylist
            </Text>
          </View>
        ) : (
        <ScrollView horizontal={true}>
          <Table style={{height: 'auto', width: responsiveWidth(130)}}
            borderStyle={{ borderWidth: 0.5, borderColor: 'gray' }}
          >
            <Row data={tableHeader}
              flexArr={[3,2,2,3,2]}
              style={styles.tableHeader}
              textStyle={styles.textHeader}
            />
              {
                this.state.tes.map((item, index) => {
                  return (
                    <Row
                      key={index}
                      data={Object.values(item)}
                      flexArr={[3,2,2,3,2]}
                      style={styles.tableContent}
                      textStyle={[
                      styles.textContent,
                      index % 2 && { color: 'gray' },
                      ]}
                    />
                  )
                })
              }
          </Table>
        </ScrollView>
        )}
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2e2d2d",
  },
  Item: {
    width: widthPercentageToDP("96%"),
    flex: 2,
    alignSelf: "center",
    margin: 1.5,
    padding: 3.5,
    backgroundColor: "#f2f2f0",
    justifyContent: "center",
  },
  tableHeader: {
    height: responsiveHeight(5.5),
    backgroundColor: '#8CAD81',
    alignSelf: 'center',
  },
  textHeader: {
    margin: 6,
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff'
  },
  tableContent: {
    height: responsiveHeight(5),
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  textContent: {
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
})
