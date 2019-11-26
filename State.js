import {observable, action} from 'mobx'

class Initial{
@observable loading = false
@observable loadingHome = true
@observable loadingSetting = true
@observable data = []
@observable paylist = []
    @action setLoading(){
    this.loading = true
    }
    @action getLoading(){
        this.loading = false
    }
    @action getLoadingHome(){
    this.loadingHome = false
    }
    @action setLoadingHome(){
        this.loadingHome = true
    }
    @action getLoadingSetting(){
        this.loadingSetting = false
    }
    @action setLoadingSetting(){
        this.loadingSetting = true
    }
}
export default new Initial()