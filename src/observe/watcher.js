import  Dep from './dep'

let id = 0
export class Watcher{
    constructor(vm,fn){
        this.id =  id++

        this.getter = fn
        this.deps= []
        this.depId= new Set()
        this.get()
    }
    get(){
        Dep.target= this
        this.getter()
        Dep.target = null
    }

    addDep(dep){
        let id = dep.id 
         if(!this.depId.has(id)){
            this.deps.push(dep)
            this.depId.add(id)
            dep.addSub(this)
         }
     
        
    }
    update(){
        this.get()
    }
}