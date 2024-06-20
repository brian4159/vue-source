import Dep from "./observe/dep";
import { observe } from "./observe/index";
import { Watcher } from "./observe/watcher";

export function initState(vm) {
    const opts = vm.$options
    if (opts.data) {
        initData(vm);
    }

    if (opts.computed) {
        initComputed(vm)
    }
    if(opts.watch){
        initWatch(vm)
    }
}
function initWatch(vm){
    let watch = vm.$options.watch
        Object.keys(watch).forEach(key => {
            const  handler = watch[key]

            if(Array.isArray(handler)){
                for(let i = 0;i<handler.length;i++){
                    createWatcher(vm,key,handler[i])
                }
            }else{
                createWatcher(vm,key,handler)

            }
        })
}
function createWatcher(vm,key,handler){
     if(typeof handler == 'string'){
        handler = vm[handler]
     }
     return vm.$watch(key,handler)
}

function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[target][key]
        },
        set(newValue) {
            vm[target][key] = newValue
        }
    })
}

function initData(vm) {
    let data = vm.$options.data
    data = typeof data == 'function' ? data.call(vm) : data;
    vm._data = data

    observe(data)

    for (let key in data) {
        proxy(vm, '_data', key)
    }

}
function initComputed(vm) {
    const computed = vm.$options.computed
    const wathcers = vm._computedWatchers = {}
    for (let key in computed) {
        let userref = computed[key]
        //    const getter =   typeof userref == 'function'?userref:userref.get
        let fn = typeof userref == 'function' ? userref : userref.get
        //     const setter = userref.set 
 
        wathcers[key] =  new Watcher(vm, fn, { lazy: true })
        defineComputed(vm, key, userref)
    }
   
}

function defineComputed(vm, key, userref) {
    const getter = typeof userref == 'function' ? userref : userref.get
    const setter = userref.set

    Object.defineProperty(vm, key, {
        get: creatComputedGetter(key),
        set: setter
    })
}

function creatComputedGetter(key){

    return function (){
        const watcher =  this._computedWatchers[key]
        if(watcher.dirty){
            watcher.evaluate()
        } 
        if(Dep.target){
                watcher.depend()
        }
     
        return watcher.value
    }
}