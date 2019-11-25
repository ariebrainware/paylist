import React from 'react'
import { ScrollView, StyleSheet, View , Text, Linking} from 'react-native'
import { Card, Title, Paragraph} from 'react-native-paper'

export default function LinksScreen() {
  return (
    <View style={styles.container}>
      <ScrollView >
        <Card>
          <Card.Content style={{alignItems:'center', paddingTop:0}}>
            <Title>PAYLIST APP</Title>
          </Card.Content>
          <Card.Content>
            <Paragraph>Pay bill, set budget per month, and jot down some buy list easily with Paylist</Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
      <View>
        <Card>
          <Card.Content style ={{alignContent:'space-around', position:'relative', left:0, right:0 }}>
            <Title>
              Paylist Team :
            </Title>
            <Paragraph>
              <Text style={{ color: '#396362', fontWeight:"400",}}
                onPress={() => Linking.openURL('https://twitter.com/_nobody404')}>
                Arie Brainware
              </Text>
            </Paragraph>
            <Paragraph>
              <Text style={{ color: '#396362', fontWeight:"400" }}
                onPress={() => Linking.openURL('https://twitter.com/offler_7')}>
                Offler Dapit
              </Text>
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    </View>
  )
}

LinksScreen.navigationOptions = {
  title: 'About',
  headerStyle: {
    backgroundColor: '#a9b0ae'
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  Content: {
    fontWeight: 'bold',
    fontSize: 12,
    fontStyle: 'italic',
    fontFamily: 'sans-serif'
  }
})
