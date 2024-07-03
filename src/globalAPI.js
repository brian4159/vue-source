
import { mergeOptions } from './utils'





export function initGlobalAPI(Vue) {
    // 静态方法
    Vue.options = {
        _base: Vue
    }
    Vue.mixin = function (mixin) {
        // 我们期望将用户的选项和 全局的options进行合并 '
        this.options = mergeOptions(this.options, mixin);
        return this;
    }

    Vue.extend = function (extendOptions) {
            function Sub(){
                this._init(options = {})
            }
            Sub.prototype=  Object.create(Vue.prototype)

            return Sub
    }   

}