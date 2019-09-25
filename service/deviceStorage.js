import { AsyncStorage }  from 'react-native';

const deviceStorage = {
    async saveKey(token, valueToSave) {
        try {
            await AsyncStorage.setItem(token, valueToSave);
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
        }
    },

    async loadJWT() {
        try {
            let value = await AsyncStorage.getItem('token');
            // let data = JSON.parse(value);
            // return data;
            if (value!== null) {
               console.log('dari device :' + value)
            } 
            return value;
            //else {
            //     this.setState({
            //         loading: false
            //     });
            // }
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