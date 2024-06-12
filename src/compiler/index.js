
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 他匹配到的分组是一个 标签名  <xxx 匹配到的是开始 标签的名字
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);  // 匹配的是</xxxx>  最终匹配到的分组就是结束标签的名字
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;  // 匹配属性
// 第一个分组就是属性的key value 就是 分组3/分组4/分组五
const startTagClose = /^\s*(\/?)>/;  // <div> <br/>

function parseHTML(html) {
    function advance(n) {
        html = html.substring(n)
    }
    function parseStartTag() {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
            }
            advance(start[0].length)
            let attr, end;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length)
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
            }
            if (end) {
                advance(end[0].length)
            }
            return match
        }
        return false
    }
    while (html) {
        let textEnd = html.indexOf('<')
        console.log(textEnd);
        if (textEnd == 0) {
            const startTagMatch = parseStartTag()
            if(startTagMatch){continue} 

            let  endTagMatch = html.match(endTag)
            if(endTagMatch){
                advance(endTagMatch[0].length)
            }
        }

        if(textEnd > 0){
            let text = html.substring(0,textEnd)
      
            if(text){
              advance(text.length)
                console.log(html);
            }
            
        }
    }
}

export function compileToFunction(template) {


    //1. 将template抓化成ast语法树
    let ast = parseHTML(template)

    //2. 生成render方法（render方法执行返回的结果是虚拟doom）
}