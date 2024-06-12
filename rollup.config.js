
import babel from 'rollup-plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve';
//rollup默认导出一个对象
export default{
    input:'./src/index.js',
    output:{
        file:'./dist/vue.js',
        name:'Vue',  
        format:'umd',
        sourcemap:true,  //生成sourceMap文件，方便调试代码。
    },
    plugins:[
        babel({
            exclude:'node_modules/**'
        }),
        nodeResolve()
    ]
}