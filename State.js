import {observable, action, autorun} from 'mobx'

class Initial{
@observable loading
@observable loadingHome 
@observable loadingSetting
@observable data = []
@observable paylist = []
    @action setLoading(){
    this.loading = true
    }
    @action getLoading(){
        this.loading = false
    }
    @action setLoadingHome(){
    this.loadingHome = false
    }
    @action setLoadingHomee(){
        this.loadingHome = null
        }
    @action getLoadingHome(){
        this.loadingHome = true
    }
    @action getLoadingSetting(){
        this.loadingSetting = false
    }
}
export default new Initial()