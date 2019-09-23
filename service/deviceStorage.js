import { AsyncStorage }  from 'react-native';

const deviceStorage = {
    async saveKey(key, valueToSave) {
        try {
            await AsyncStorage.setItem(key, valueToSave);
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
        }
    },

    async loadJWT() {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                this.setState({
                    jwt: value,
                    loading: false
                });
            } else {
                this.setState({
                    loading: false
                });
            }
        } catch (error) {
            console.log('AsyncStorage error :' + error.message);
        }
    },

    async deleteJWT() {
        try{
            await AsyncStorage.removeItem('token')
            .then(
                () => {
                    this.setState({
                        jwt:''
                    })
                }
            );
        } catch (error){
            console.log('AsyncStorage Error: ' + error.message);
        }
    }
};

export default deviceStorage;