import {observable, action} from 'mobx'

class Initial{
@observable loading = true
@observable loadingHome 
@observable loadingSeting = true
@observable data = []
@observable paylist = []
    @action setLoading(){
    this.loading = true
    }
    @action getLoading(){
        this.loading = false
    }
    @action setLoadingHome(){
    this.loadingHome = true
    }
    @action getLoadingHome(){
        this.loadingHome = false
    }
    @action getLoadingSetting(){
        this.loadingSeting = false
    }
}
export default new Initial()