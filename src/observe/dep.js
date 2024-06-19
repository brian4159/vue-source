let  id = 0

class Dep {
    constructor(){
        this.id  = id++
        this.subs = []

    }

    addWatch(){
        Dep.target.addDep(this)
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    notify(){
        this.subs.forEach(wathcer=>wathcer.update())
    }
}
Dep.target = null 
 
let stack =[]
export function pushTarget(watcher){
    Dep.target = watcher
    stack.push(watcher)
}

export function popTarget(){
    stack.pop()

    Dep.target = stack[stack.length-1]
    console.log( Dep.target,' Dep.target');
}

export default Dep