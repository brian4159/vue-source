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
 
export default Dep