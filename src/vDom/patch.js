export function patchProps(el,props){
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
  export function createEle(vnode){
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
  export function patch(oldVnode,vnode){
  
      const isRealElement = oldVnode.nodeType;
      if(isRealElement){
          const elm = oldVnode
          const parentELe  = elm.parentNode
          let newEle = createEle(vnode)
          
          parentELe &&  parentELe.insertBefore(newEle,elm.nextSibling)
          parentELe && parentELe.removeChild(elm)
          return newEle
      }else{

      }
    }