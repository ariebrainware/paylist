import {observable} from 'mobx'

class Initial{
@observable loading
    getState(){
        this.loading = false
    }

    setState(){
        this.loading = true
    }
}
export default new Initial()