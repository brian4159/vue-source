export function createElementNode(vm,tag,data,...children){
    if(data === null){
        data = {}
    }
    let key = data.key 
    if(key){
        delete data.key
    }
    return  vnode(vm,tag,key,data,children)
}

export function createTextNode(vm,text){
        return vnode(vm,undefined,undefined,undefined,undefined,text)
}

function vnode(vm,tag,key,data,children,text){
        return {
            vm,
            tag,
            key,
            data,
            children,
            text
        }
}