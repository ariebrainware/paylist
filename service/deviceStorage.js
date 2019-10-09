import { AsyncStorage } from 'react-native'

const deviceStorage = {
  async saveKey(token, valueToSave) {
    try {
      await AsyncStorage.setItem(token, valueToSave)
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message)
    }
  },

    async loadJWT() {
        try {
            let payload = await AsyncStorage.getItem('token');
            let token = JSON.parse(payload);
            return token.value;
        } catch (error) {
            console.log('AsyncStorage error :' + error.message);
        }
    },

    async deleteJWT() {
        try{
            let payload = await AsyncStorage.getItem('token');
            let token = JSON.parse(payload);
            await AsyncStorage.removeItem(token.value);
            return token.value;
        } catch (error){
            console.log('AsyncStorage Error: ' + error.message);
        }
    }
  }

export default deviceStorage