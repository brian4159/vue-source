import { compileToFunction } from "./compiler";
import { mountComponent } from "./lifecycle";
import { nextTick } from "./observe/watcher";
import { initState } from "./state";



export function initMixin(Vue) { //vue实例的初始化方法 
    Vue.prototype._init = function (options) {

        const vm = this
        vm.$options = options;//将用户传入的配置项赋值给this.$options，方便后续使用。

        //初始化状态
        initState(vm)


        if (options.el) {
            vm.$mount(options.el)
        }
    }

    Vue.prototype.$mount = function (el) {
        const vm = this;
        el = document.querySelector(el)

        let options = vm.$options
        if (!options.render) {
            let template
            if (!options.template && el) {
                template = el.outerHTML
            } else {
                if (el) {
                    template = options.template
                 
                }
            }
            if(template){
                    const render =compileToFunction(template)
                    options.render=render   
                   
            }
        }
        mountComponent(vm, el)
       
        //runtime运行时不包含模板编译，整个编译时打包的时候通过loader来转义.vue文件
    }
    Vue.prototype.$nextTick = nextTick
}

