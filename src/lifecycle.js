import { createElementNode, createTextNode } from "./vDom"
import { Watcher } from "./observe/watcher" 
function patchProps(el,props){
  for(let key in props){
    if(key === 'style'){
        for(let styleName in props.style){
            el.style[styleName] = props.style[styleName]
        }
    }else{
        el.setAttribute(key,props[key])
    }
  
  }
}
function createEle(vnode){
    let {tag,data,children,text}  = vnode
    if(typeof tag === 'string'){
      vnode.el =  document.createElement(tag)
      patchProps(vnode.el,data)
      children.forEach(child => {
          vnode.el.appendChild(createEle(child))
      });
    }else{
       vnode.el= document.createTextNode(text)
    }
    return vnode.el
}
function patch(oldVnode,vnode){

    const isRealElement = oldVnode.nodeType;
    if(isRealElement){
        const elm = oldVnode
        const parentELe  = elm.parentNode
        let newEle = createEle(vnode)
        
        parentELe &&  parentELe.insertBefore(newEle,elm.nextSibling)
        parentELe && parentELe.removeChild(elm)

        return  newEle
    }else{

    }
}

export function initLifeCycle(Vue){


    Vue.prototype._update = function(vnode){
        const vm = this
        const  el = vm.$el

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
    console.log(2);
    let watcher = new Watcher(vm,updateComponet)
    
}