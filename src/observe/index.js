import {newArrayProto} from  "./array"
import Dep from './dep'
export function observe(data){
   if(typeof data !== 'object' || data == null){
     return;
   }
  
if(data.__ob__ instanceof Observer){
    return data.__ob__
}
   return new Observer(data)
}


class Observer{
    constructor(data){

      Object.defineProperty(data,'__ob__',{
        value:this,
        enumerable:false //不可枚举
      })
      if(Array.isArray(data)){
        // data.__ob__ = this
        //重写数组方法 7个变异  
        data.__proto__ = newArrayProto
          this.observeArray(data)
      }else{
        this.walk(data)
      }
      
    }

    walk(data){
      //重新定义属性
      Object.keys(data).forEach(key=>defineReactive(data,key,data[key]))
    }
    observeArray(data){
      data.forEach(item=>{
        observe(item)
      })
    }

}

export function defineReactive(target,key,value){
  observe(value) //对所有的对象进行属性劫持
  let dep =  new Dep()
  Object.defineProperty(target,key,{
    get(){
      if(dep && Dep.target){
        dep.addWatch()
        
      }
      return value
    },
    set(newValue){
      if(value === newValue)return
      observe(newValue) 
      value = newValue
    }
  })

}