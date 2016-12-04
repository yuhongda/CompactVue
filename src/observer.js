import Dep from './dep'

export default class Observer {
    constructor(value){
        this.value = value
        this.walk(value)
    }
    walk(value){
        Object.keys(value).forEach((key) => { this.convert(key, value[key]) })
    }
    convert(key, val){
        defineReactive(this.value, key, val)
    }
}

export function defineReactive(obj, key, val){
    var dep = new Dep()

    var childOb = observe(val)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => {
            console.warn('读取 value')
            if(Dep.target){
                var has = false;
                for (var i = 0, l = dep.subs.length; i < l; i++){
                    if(dep.subs[i].expOrFn == Dep.target.expOrFn){
                        has = true
                    }
                }
                if(!has)
                    dep.addSub(Dep.target)
            }
            return val
        },
        set: (newValue) => {
            if(val === newValue) return
            console.warn('设置 new value')

            val = newValue

            childOb = observe(newValue)

            dep.notify()
        }
    })
} 

export function observe(value){
    if(!value || typeof value !== 'object'){
        return
    }
    return new Observer(value)
}
