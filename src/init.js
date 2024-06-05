import {initState} from "./state";



export function initMixin(Vue){ //vue实例的初始化方法 
    Vue.prototype._init = function (options) {

        const vm = this
        vm.$options = options;//将用户传入的配置项赋值给this.$options，方便后续使用。

        //初始化状态
       initState(vm)

    }
}

