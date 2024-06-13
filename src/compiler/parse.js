
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 他匹配到的分组是一个 标签名  <xxx 匹配到的是开始 标签的名字
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);  // 匹配的是</xxxx>  最终匹配到的分组就是结束标签的名字
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;  // 匹配属性
// 第一个分组就是属性的key value 就是 分组3/分组4/分组五
const startTagClose = /^\s*(\/?)>/;  // <div> <br/>

export function parseHTML(html) {

    const ElEMENT_TYPE = 1
    const TEXT_TYPE = 3
    const stack = []
    let root ,currentParent;
    function createASTElement(tag,attrs) {
        return {
            tag,
            attrs,
            type: ElEMENT_TYPE,
            children: []
        }
    }
    function start(tag,attr) {
       let node = createASTElement(tag,attr)
       if(!root){
        root = node
       }
       if(currentParent){
        node.parent = currentParent
        currentParent.children.push(node)
    }
       currentParent = node
       stack.push(node)

      
    }
    function chars(text) {
        text = text.replace(/\s/g,'')
        text && currentParent.children.push(
            {
                type:TEXT_TYPE,
                text,
                parent:currentParent
            })
    }
    function  end(tag) {
       stack.pop()
       currentParent = stack[stack.length-1]
    }
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
        if (textEnd == 0) {
            const startTagMatch = parseStartTag()
            if(startTagMatch){ 
                start(startTagMatch.tagName,startTagMatch.attrs) 
                continue} 

            let  endTagMatch = html.match(endTag)
            if(endTagMatch){
                 end(endTagMatch[1])
                advance(endTagMatch[0].length)
            }
        }

        if(textEnd > 0){ 
          
            let text = html.substring(0,textEnd)
      
            if(text){
                chars(text)
              advance(text.length)
               
            }
            
        }
    
    }
  return root
}