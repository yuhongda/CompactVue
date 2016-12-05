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

            if(self.isElementNode(node)){
                self.compile(node);

            } else if(self.isTextNode(node) && reg.test(text)){
                self.compileText(node, RegExp.$1);
            }

            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node);
            }
        })
    }
    compile(node){
        var nodeAttrs = node.attributes,
            self = this;

        [].slice.call(nodeAttrs).forEach((attr) => {
            var attrName = attr.name

            if(self.isMustache(attr.value)){
                compileUtil.attr(node, self.$vm, attr);
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
    isMustache(value){
        return /\{\{(.*)\}\}/.test(value);
    }
}


var compileUtil = {
    text: function(node, vm, exp) {
        for(var key in vm.$data){
            var reg = new RegExp('\\$' + key, 'g');
            if(reg.test(exp)){
                this.bind(node, vm, key, 'text', exp);
            }
        } 
    },
    attr: function(node, vm, attr) {

        for(var key in vm.$data){
            var reg = new RegExp('\\$' + key, 'g');

            if(reg.test(attr.value)){
                this.bind(node, vm, key, 'attr', attr);
            }
        } 

    },
    bind: function(node, vm, exp, dir, attr) {
        if(dir == 'text'){
            var updaterFn = updater[dir + 'Updater'];

            new Watcher(vm, exp, attr, function(value, oldValue, fullExp) {
                updaterFn && updaterFn(node, vm, exp, value, fullExp);
            });
            updaterFn && updaterFn(node, vm, exp, this._getVMVal(vm, exp), attr);

        }else{
            var updaterFn = updater[dir + 'Updater'];

            new Watcher(vm, exp, attr, function(value, oldValue, _attr, attrValue) {
                updaterFn && updaterFn(node, vm, exp, value, _attr, attrValue);
            }, attr.value);
            updaterFn && updaterFn(node, vm, exp, this._getVMVal(vm, exp), attr, attr.value);
        }
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
    textUpdater(node, vm, exp, value, fullExp){
        var valueExp = fullExp.replace(/\{\{/, '').replace(/\}\}/, '').replace(/\s+/, '');
        for(var key in vm.$data){

            var reg = new RegExp('\\$(' + key + ')','g');

            valueExp = valueExp.replace(reg, (match, capture) => {

                if(capture == exp){
                    return typeof value == 'number' ? value : '\''+value+'\'';
                }else{
                    return typeof vm.$data[capture] == 'number' ? vm.$data[capture] : '\''+vm.$data[capture]+'\'';
                }
            })

        }
        node.textContent = eval(valueExp) || '';
    },
    attrUpdater(node, vm, exp, value, attr, attrValue){
        console.log(attr)
        var valueExp = attrValue.replace(/\{\{/, '').replace(/\}\}/, '').replace(/\s+/, '');
        for(var key in vm.$data){

            var reg = new RegExp('\\$(' + key + ')','g');

            valueExp = valueExp.replace(reg, (match, capture) => {

                if(capture == exp){
                    return typeof value == 'number' ? value : '\''+value+'\'';
                }else{
                    return typeof vm.$data[capture] == 'number' ? vm.$data[capture] : '\''+vm.$data[capture]+'\'';
                }
            })

        } 
        node.attributes[attr.name].value = eval(valueExp) || '';
    }
}