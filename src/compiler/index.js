import { parseHTML } from "./parse";


export function compileToFunction(template) {

    //1. 将template抓化成ast语法树
    let ast =  parseHTML(template)
    console.log(ast);
    
}