
export function observe(data){
   if(typeof data !== 'object' || data == null){
     return;
   }

   return new Observer(data)
}


class Observer{
    constructor(data){
          this.walk(data)
    }

    walk(data){
      //重新定义属性
      Object.keys(data).forEach(key=>defineReactive(data,key,data[key]))
    }

}

export function defineReactive(target,key,value){
  observe(value) //对所有的对象进行属性劫持
  Object.defineProperty(target,key,{
    get(){
      console.log('取值');
      return value
    },
    set(newValue){
      console.log('设置值');
      if(value === newValue)return
      value = newValue
    }
  })
}