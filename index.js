//我真是小脑袋瓜热昏头了才会用node写爬虫

//颜色格式
/***************************************************************
 * CHS ENG RGB HEX COLOR
 * 
 *************************************************************/

const MDN_CSS_COLORS_URL="https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value"
const NIPPON_COLORS_URL="https://nipponcolors.com"

const axios = require("axios")
const cheerio = require("cheerio")

async function get_mdn_colors(){
    const mdn_css_page=await axios.get(MDN_CSS_COLORS_URL)
    const $=cheerio.load(mdn_css_page.data)
    const colors=[]
    let i=0;
    $("#colors_table tbody tr td").each((index,ele)=>{
        let text=$(ele).text()
        if(-1!==text.indexOf("CSS")||text===""||text==="\n") return ;
        //名称
        if(-1!=text.indexOf("（")){
            let chs=text.substring(text.indexOf("（")+1,text.indexOf("）"))
            let eng=text.substring(0,text.indexOf("（"))
            colors[i]={}
            colors[i]["chs"]=chs
            colors[i]["eng"]=eng

        }else{
            //值
            let r=parseInt(text.substr(1,2),16)
            let g=parseInt(text.substr(3,2),16)
            let b=parseInt(text.substr(5,2),16)
            colors[i]["hex"]=text
            colors[i]["rgb"]="("+r+","+g+","+b+")"
            i++
        }
    })
    return colors
}

async function get_nippon_colors(){
    const mdn_css_page=await axios.get(NIPPON_COLORS_URL)
    const $=cheerio.load(mdn_css_page.data)
    const colors=[]
    $("#colors li div a").each((index,ele)=>{
        const name=$(ele).text()
        console.log(name,$(ele).attr("href"))
    })
}

async function run(){
    const mdn_colors=await get_mdn_colors()
    // const nippon_colors=await get_nippon_colors()
    // console.log(mdn_colors)
    const fs=require("fs")
    fs.writeFileSync("mdn_color.json",JSON.stringify(mdn_colors))
}

run()