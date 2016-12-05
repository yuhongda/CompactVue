import Dep from './dep'

export default class Watcher{
    constructor(vm, exp, fullExp, callback, attrValue){
        this.id = new Date().getTime()
        this.vm = vm
        this.fullExp = fullExp
        this.attrValue = attrValue
        this.callback = callback
        this.exp = exp
        this.val = this.get()
    }
    update(){
        this.run()
    }
    run(){
        const val = this.get()
        var oldVal = this.val;
        if(val !== oldVal){
            this.val = val
            this.callback.call(this.vm, val, oldVal, this.fullExp, this.attrValue)
        }
    }
    get(){
        Dep.target = this
        const val = this.vm.$data[this.exp]

        Dep.target = null
        return val
    }
}