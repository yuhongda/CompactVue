import Dep from './dep'

export default class Watcher{
    constructor(vm, exp, callback){
        this.vm = vm
        this.callback = callback
        this.exp = exp
        this.val = this.get()
    }
    update(){
        this.run()
    }
    run(){
        const val = this.get()
        var oldVal = this.value;
        if(val !== oldVal){
            this.val = val
            this.callback.call(this.vm, val, oldVal)
        }
    }
    get(){
        Dep.target = this
        const val = this.vm.$data[this.exp]
        
        Dep.target = null
        return val
    }
}