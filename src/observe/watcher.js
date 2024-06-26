import Dep, { popTarget, pushTarget } from './dep'

let id = 0
export class Watcher {
    constructor(vm, fn, options,cb) {
        this.id = id++
        this.vm = vm
        this.renderWatcher = options
        if(typeof fn === 'string'){
            this.getter = function(){ return vm[fn]}
        }else{
            this.getter =  fn
        }
        this.cb = cb
      
        this.deps = []
        this.depId = new Set()
        this.user = options?.user
    
        this.lazy = options?.lazy
        this.dirty = this.lazy
        this.value = this.lazy ? undefined : this.get()
    }
    get() {
        console.log(this,'watch');
        pushTarget(this)
        let value = this.getter.call(this.vm)
        popTarget()
        return value
    }

    addDep(dep) {
        let id = dep.id
        if (!this.depId.has(id)) {
            this.deps.push(dep)
            this.depId.add(id)
            dep.addSub(this)
        }
    

    }
    update() {
        if (this.lazy) {
            this.dirty = true
        } else {
            queueWatcher(this)
        }
    }
    evaluate() {

        this.value = this.get()
        this.dirty = false
    }
    depend() {
        let i = this.deps.length
        while (i--) {
            this.deps[i].addWatch()
        }
    }
    run() {

        let oldValue = this.value
        let newValue =  this.get()
        if(this.user){          
            this.cb.call(this.vm,newValue,oldValue)
        }
    }
}


let queue = []
let has = {}
let pending = false

function flushSchedulerQueue() {
    let flueshQueue = queue.slice(0)
    queue = []
    has = {}
    pending = false
    flueshQueue.forEach(watcher => watcher.run())
}
function queueWatcher(watcher) {
    let id = watcher.id
    if (!has[id]) {
        queue.push(watcher)
        has[id] = true
        // nextTick(flushSchedulerQueue)
        if (!pending) {

            nextTick(flushSchedulerQueue)

            pending = true
        }
    }

}

let callBackArr = []
let waiting = false

function flueshCallBack() {
    let cbs = callBackArr
    callBackArr.forEach(cb => cb())
    callBackArr = []
    waiting = false
}
export function nextTick(cb) {
    callBackArr.push(cb)
    if (!waiting) {
        Promise.resolve().then(flueshCallBack)
        waiting = true
    }

}