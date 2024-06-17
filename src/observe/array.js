//重写数组中的部分方法


let old_array_proto = Array.prototype

export let newArrayProto =   Object.create(old_array_proto);

let methods = [
    'push','pop','shift','unshift','reverse','sort','splice'
]


methods.forEach(method=>{
        
    newArrayProto[method]=function(...args){
      const result =   old_array_proto[method].call(this,...args)  //函数劫持，切片编程

      //    对新增的数据进行劫持
      let inserted;
      switch (method) {
        case 'push':
        case 'unshift':
            inserted = args
            break;
            case 'splice':
            inserted =args.slice(2)
        default:
            break;
      }
      if(inserted){
            this.__ob__.observeArray(this)
      }


      //更新页面
      this.__ob__.dep.notify()
      return result
    }

})
