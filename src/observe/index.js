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
     //给每个对象增加依赖收集
        this.dep = new Dep()


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

function dependArray(data){
     for(let i = 0;i <data.length;i++){
      let currentItem = data[i]
      currentItem.__ob__  &&  currentItem.__ob__.dep.addWatch() 
      if(Array.isArray(currentItem)){
        dependArray(currentItem)
      }
     }
}

export function defineReactive(target,key,value){
  
  let childObe  =   observe(value) //对所有的对象进行属性劫持
  let dep =  new Dep()
  Object.defineProperty(target,key,{
    get(){
      if(dep && Dep.target){
        dep.addWatch()
        if(childObe){
          childObe.dep.addWatch()   
          if(Array.isArray(value)){
              dependArray(value)
          }        
        }
      }
      return value
    },
    set(newValue){
      if(value === newValue)return
      observe(newValue) 
      dep.notify()
    
      value = newValue
    }
  })

}