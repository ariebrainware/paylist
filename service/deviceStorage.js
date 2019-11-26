import { AsyncStorage } from 'react-native'

let deviceStorage = {
  async saveKey(token, valueToSave) {
    try {
      await AsyncStorage.setItem(token, valueToSave)
    } catch (error) {
    }
  },

  async loadJWT() {
    try {
      let payload = await AsyncStorage.getItem('token')
      let token = JSON.parse(payload)
      return token.value
    } catch (error) {
    }
  },

  async deleteJWT() {
    try {
      let payload = await AsyncStorage.getItem('token')
      let token = JSON.parse(payload)
      await AsyncStorage.removeItem(token.value)
      AsyncStorage.removeItem('token')
      return token.value
    } catch (error) {
      console.log('AsyncStorage Error: ' + error)
    }
  }
}

export default deviceStorage