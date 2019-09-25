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
            let payload = await AsyncStorage.getItem('token');
            let token = JSON.parse(payload);
            // console.log(token.value)
            // if (!token) {
                // console.log('dari device :' + token.value);
            return token.value;
            // } 
            //else {
            //     this.setState({
            //         loading: false
            //     });
            // }
            // alert('You\'re not authorized to perform this action')
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