import React, {Component} from 'react'
import {ScrollView,View,StyleSheet} from 'react-native'
import {Card} from 'react-native-paper'
import {inject, observer} from 'mobx'

//@inject('store') @observer
export default class ReportDetails extends React.Component{
    constructor(props){
        super(props)
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