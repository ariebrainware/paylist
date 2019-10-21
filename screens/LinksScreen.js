import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Card, Title, Paragraph } from 'react-native-paper'
import { ExpoLinksView } from '@expo/samples'

export default function LinksScreen() {
  return (
    <ScrollView style={styles.container}>
    <View>
      <Card>
        <Card.Content style={{alignItems:'center', paddingTop:0}}>
          <Title>PAYLIST APP</Title>
        </Card.Content>
        <Card.Content>
          <Paragraph>Pay bill, set budget per month, and jot down some buy list easily with Paylist</Paragraph>
        </Card.Content>
      </Card>
    </View>
    </ScrollView>
  )
}

LinksScreen.navigationOptions = {
  title: 'Links',
  headerStyle:{
    backgroundColor:'#a9b0ae'
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  Content:{
    fontWeight:'bold',
    fontSize: 12,
    fontStyle:"italic",
    fontFamily:"sans-serif"
  }
})
