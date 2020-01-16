import React from 'react'
import { ScrollView, StyleSheet, View , Text, Linking} from 'react-native'
import { Card, Title, Paragraph} from 'react-native-paper'

export default function LinksScreen() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Card>
          <Card.Content style={{alignItems:'center', paddingTop:0,backgroundColor:'#2e2d2d'}}>
            <Title style={{color:'#8CAD81'}}>PAYLIST APP</Title>
          </Card.Content>
          <Card.Content style={{backgroundColor:'#2e2d2d'}}>
            <Paragraph style={{color:'#8CAD81'}}>Pay bill, set budget per month, and jot down some buy list easily with Paylist</Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
        <Card>
          <Card.Content style ={{alignContent:'space-around', position:'relative', left:0, right:0,backgroundColor:'#2e2d2d'}}>
            <Title style={{color:'#8CAD81'}}>
              Paylist Team :
            </Title>
            <Paragraph>
              <Text style={{ color: '#ccbc58', fontWeight:"400",}}
                onPress={() => Linking.openURL('https://twitter.com/_nobody404')}>
                Arie Brainware
              </Text>
            </Paragraph>
            <Paragraph>
              <Text style={{ color: '#ccbc58', fontWeight:"400" }}
                onPress={() => Linking.openURL('https://twitter.com/offler_7')}>
                Offler Dapit
              </Text>
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    )
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#2e2d2d',
  },
  Content: {
    fontWeight: 'bold',
    fontSize: 12,
    fontStyle: 'italic',
    fontFamily: 'sans-serif'
  }
})
