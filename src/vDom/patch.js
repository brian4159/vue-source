import { isSameVnode } from "."

export function patchProps(el, oldProps,props) {
    let oldStyles = oldProps && oldProps.style
    let newStyles = props && props.style


    for(let key in oldStyles){
        if(!newStyles[key]){
            el.style[key] = ''
        }
        
    }

    for (let key in oldProps) { 
        if (!props[key]) {
            el.removeAttribute(key)
        }
    }

  

    for (let key in props) {
        if (key === 'style') {
            for (let styleName in props.style) {
                el.style[styleName] = props.style[styleName]
            }
        } else {
            el.setAttribute(key, props[key])
        }

    }
}
export function createEle(vnode) {
    let { tag, data, children, text } = vnode
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag)
        patchProps(vnode.el, {},data)
        children.forEach(child => {
            vnode.el.appendChild(createEle(child))
        });
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}
export function patch(oldVnode, vnode) {

    const isRealElement = oldVnode.nodeType;
    if (isRealElement) {
        const elm = oldVnode
        const parentELe = elm.parentNode
        let newEle = createEle(vnode)

        parentELe && parentELe.insertBefore(newEle, elm.nextSibling)
        parentELe && parentELe.removeChild(elm)
        return newEle
    } else {
        //diff
        if (!isSameVnode(oldVnode, vnode)) {
            let el = createEle(vnode)
            oldVnode.el.parentNode.replaceChild(el, oldVnode.el)
            return el
        }

        let el = vnode.el = oldVnode.el
        if (!el.tag) { //非标签
            if (oldVnode.text !== vnode.text) { //文本不相同
                el.textContent = vnode.text
            }
        }
        patchProps(el, oldVnode.data,vnode.data)
        

        let oldChildren = oldVnode.children || []
        let newChildren = vnode.children || []

        if(oldChildren.length > 0 && newChildren.length > 0){
            patchChildren(el,oldChildren,newChildren)
        }else if(newChildren.length > 0){ //新节点有子节点
            for(let i = 0;i<newChildren.length;i++){
                let child = newChildren[i]
                el.appendChild(createEle(child))
            }
        }else if(oldChildren.length > 0){ //老节点有子节点
            el.innerHTML = ''
        }
    }
}

function patchChildren(el,oldChildren,newChildren){
    let oldStartIndex = 0;
    let newStartIndex = 0;
    let oldEndIndex = oldChildren.length - 1;
    let newEndIndex = newChildren.length - 1;

    let oldStartVnode = oldChildren[0];
    let oldEndVnode = oldChildren[oldEndIndex];
    
    let newStartVnode = newChildren[0];
    let newEndVnode = newChildren[newEndIndex];

    while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex){
        if(oldStartVnode.key === newStartVnode.key){
            patch(oldStartVnode,newStartVnode)
    }
        
}
}