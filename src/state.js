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
    for (let key in computed) {
        let userref = computed[key]
        //    const getter =   typeof userref == 'function'?userref:userref.get
        let fn = typeof userref == 'function' ? userref : userref.get
        //     const setter = userref.set 
        new Watcher(vm, fn, { lazy: true })
        defineComputed(vm, key, userref)
    }
}

function defineComputed(vm, key, userref) {
    const getter = typeof userref == 'function' ? userref : userref.get
    const setter = userref.set

    Object.defineProperty(vm, key, {
        get: getter,
        set: setter
    })
}