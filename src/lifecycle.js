import { createElementNode, createTextNode } from "./vDom"
import { Watcher } from "./observe/watcher" 
import { patch } from "./vDom/patch"


export function initLifeCycle(Vue){

    Vue.prototype._update = function(vnode){
        const vm = this
        const  el = vm.$el
        console.log(el,'el');
        vm.$el  = patch(el,vnode) //把最新的虚拟doom赋值给元素
    }
  
    Vue.prototype._c = function(){
    
        return createElementNode(this,...arguments)
    }
    Vue.prototype._v = function(){
        return createTextNode(this,...arguments)
    }
    Vue.prototype._s = function(value){
        if(typeof value !== 'object') return value
        return JSON.stringify(value)
    }
    Vue.prototype._render =  function(){
        const vm  = this
      return  vm.$options.render.call(vm)
    }
  
}
export function mountComponent(vm,el){
    vm.$el = el 
    const updateComponet = ()=>{
        vm._update(vm._render())
       
    }
  
    let watcher = new Watcher(vm,updateComponet)
    
}