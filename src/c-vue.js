import Observer, {observe} from './observer'
import Watcher from './watcher'
import Compile from './compile'

function CVue(options){
    this.$options = options

    let data = this.$data = this.$options.data
    Object.keys(data).forEach(key => this._proxy(key))
    observe(data)
    console.log();
    this.$compile = new Compile(options.el || document.body, this)
}

CVue.prototype = {
    $watch(key, callback){
        new Watcher(this, key, callback)
    },
    _proxy(key){
        Object.defineProperty(this, key, {
            configurable: true,
            enumerable: true,
            get: () => {
                this.$data[key]
            },
            set: (val) => {
                this.$data[key] = val
            }
        })
    }
}
window.CVue = CVue
    