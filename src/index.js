import { initMixin } from "./init"
import { initLifeCycle } from "./lifecycle"
import { Watcher, nextTick } from "./observe/watcher"

function Vue(options) {

    this._init(options)

}
Vue.prototype.$nextTick = nextTick

initMixin(Vue)
initLifeCycle(Vue)

Vue.prototype.$watch = function (expOrFn, cb, options) {
   
    new Watcher(this, expOrFn, {user: true}, cb)
}

export default Vue