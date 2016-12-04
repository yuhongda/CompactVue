import Watcher from './watcher'

export default class Compile{
    constructor(el, vm){
        this.$vm = vm
        this.$el = this.isElementNode(el) ? el : document.querySelector(el)

        if(this.$el){
            this.$fragment = this.node2Fragment(this.$el)
            this.init()
            this.$el.appendChild(this.$fragment)
        }
    }
    node2Fragment(el){
        var fragment = document.createDocumentFragment(),
            child

        while(child = el.firstChild){
            fragment.appendChild(child)
        }

        return fragment
    }
    init(){
        this.compileElement(this.$fragment)
    }
    compileElement(el){
        var childNodes = el.childNodes,
            self = this;
        
        [].slice.call(childNodes).forEach((node) => {
            var text = node.textContent;
            var reg = /\{\{(.*)\}\}/;

            if(self.isTextNode(node) && reg.test(text)){
                self.compileText(node, RegExp.$1);
            }
        })
    }
    compileText(node, exp){
        compileUtil.text(node, this.$vm, exp);
    }
    isElementNode(node) {
        return node.nodeType == 1;
    }
    isTextNode(node) {
        return node.nodeType == 3;
    }
}


var compileUtil = {
    text: function(node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },
    bind: function(node, vm, exp, dir) {
        var updaterFn = updater[dir + 'Updater'];

        updaterFn && updaterFn(node, this._getVMVal(vm, exp));

        new Watcher(vm, exp, function(value, oldValue) {
            updaterFn && updaterFn(node, value, oldValue);
        });
    },
    _getVMVal: function(vm, exp){
        var val = vm.$data;

        exp = exp.split('.');
        exp.forEach((key) => {
            val = val[key]
        });
        return val
    }
};

var updater = {
    textUpdater(node, value){
        node.textContent = typeof value == 'undefined' ? '' : value;
    }
}