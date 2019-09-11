
/**
 * 字符串截取
 * @param str
 * @param num
 */
function splitStr(str,length){
    if(str == undefined) {
        return '';
    }
    if(str.length > length){
        return str.substring(0,length)+'..';
    } else {
        return str;
    }
}


/**
 * 时间字符串的拆分
 * @param value
 * @returns {*}
 */
function splitTime(value){
    var patt = /(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})/;
    var result = patt.exec(value)

    if(result){
        return {
            y:result[1],
            m:result[2],
            d:result[3],
            h:result[4],
            mi:result[5],
            s:result[6]
        }
    } else {
        patt = /(\d{4})-(\d{1,2})-(\d{1,2})/;
        result = patt.exec(value)
        if(result){
            return {
                y:result[1],
                m:result[2],
                d:result[3],
                h:'',
                mi:'',
                s:''
            }
        } else {
            return {
                y:'',
                m:'',
                d:'',
                h:'',
                mi:'',
                s:''
            }
        }

    }

}


/**
 * 下载文件
 * @param url
 */
function downloadFile(url) {
    //创建iframe
    if(!document.getElementById('myframe')){
        var elemIF = document.createElement("iframe")
        elemIF.name = 'myframe'
        elemIF.id = 'myframe'
        //elemIF.src = url
        elemIF.style.display = "none"
        document.body.appendChild(elemIF)
    }

    // 创建a标签
    var a = document.createElement('a')
    //a.download = filename
    a.href = url
    a.style.display = 'none'
    a.target = 'myframe'   //指向iframe
    document.body.appendChild(a);
    // 创建鼠标事件
    var evt = document.createEvent("MouseEvents");
    // 类型为点击，不冒泡，不能用preventEvent。
    evt.initEvent("click", false, false);
    // 触发事件
    a.dispatchEvent(evt);
    // 移除a标签
    document.body.removeChild(a);

}


function getConfig(name){
    let config = {
        device:'wxapp'
    }
    return config[name];
}

export default {
    splitStr,
    downloadFile,
    splitTime,
    getConfig
}
