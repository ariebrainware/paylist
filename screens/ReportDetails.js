import React, {Component} from 'react'
import {ScrollView,View,StyleSheet, BackHandler} from 'react-native'
import {Card} from 'react-native-paper'
import {inject, observer} from 'mobx'

//@inject('store') @observer
export default class ReportDetails extends React.Component{
    constructor(props){
        super(props)
        this.onBackButtonPressed = this.onBackButtonPressed.bind(this)
    }
    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress',this.onBackButtonPressed)
    }
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed)
    }
    onBackButtonPressed() {
        this.props.navigation.navigate('Main')
        return true
    }    

    render(){
        return(
            <View style={styles.container}>
                <ScrollView>
                    <Card></Card>
                </ScrollView>
            </View>
        )
    }
}


let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
})