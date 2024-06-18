import Dep from './dep'

let id = 0
export class Watcher {
    constructor(vm, fn,options) {
        this.id = id++
        this.renderWatcher = options
        this.getter = fn
        this.deps = []
        this.depId = new Set()
        this.lazy = options.lazy
        this.dirty = this.lazy

        this.lazy ?  undefined : this.get()
    }
    get() {
        Dep.target = this
        this.getter()
        Dep.target = null
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
        queueWatcher(this)

    }

    run() {

        this.get()
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
    if(!waiting){
        Promise.resolve().then(flueshCallBack)
        waiting = true
    }
 
}