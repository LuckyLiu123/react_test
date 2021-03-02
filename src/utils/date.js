
//日期转换为字符串
function FormatDate(date, format = 'yyyy-MM-dd'){
    try{
        let o = {
            //格式化数据，多字符串必须放在前面
            'yyyy': date.getFullYear(),
            'MM': DateFormatZero(date.getMonth() + 1),
            'dd': DateFormatZero(date.getDate()),
            'hh': DateFormatZero(date.getHours()),
            'mm': DateFormatZero(date.getMinutes()),
            'ss': DateFormatZero(date.getSeconds()),
            'y': date.getFullYear(),
            'M': date.getMonth() + 1,
            'd': date.getDate(),
            'h': date.getHours(),
            'm': date.getMinutes(),
            's': date.getSeconds(),
            'q': Math.floor((date.getMonth() + 3) / 3),
            's': date.getMilliseconds()
        };

        for(let key in o){
            format = format.replace(key, o[k]);
        }
        return format;
    } catch (e){
        console.log(e.message);
        return '';
    }
}

//简单日期转换 yyyy-MM-dd h** 转换为 yyyy-MM-dd
function NormalTimeYmd(str){
    try{
        return str.split(' ')[0];
    } catch (e){
        return str;
    }
}

//字符串转换日期
function ParseDate(str){
    let date = null;
    let nowDate = new Date();
    try{
        if(str != null && str != ''){
            let regNum = /^[1-3][0-9]{7}$/;
            if(str instanceof Date){
                date = str;
            }else{
                if(str.indexOf('Date') > -1){
                    date = new Date(parseInt(str.replace('/Date(', '').replace(')/', ''), 10));
                }else if(str.indexOf(':') > -1){
                    date = new Date(str.replace(/\-/g, '/'));
                }else if(!isNaN(str)){
                    if(str.length > 8){
                        date = new Date(str);
                    }else if(str.length === 8){
                        date = new Date(str.substr(0, 4) + '/' + str.substr(4, 2) + '/' + str.substr(6, 2));
                    }else if(str.length === 4){
                        date = new Date(year + '/' + str.substr(0, 2) + '/' + str.substr(2, 2));
                    }
                }else if(/[1-9]+/.test(str)){
                    str = str.replace(/[^0-9]/g, '/').replace(/^\/+/, '').replace(/\/+$/, '').replace(/\/+/g, '/');
                    let year = str.length < 6 ? nowDate.getFullYear() + '/' : '';
                    date = new Date(year + str);
                }
            }
        }
        date = date === 'Invalid Date' ? null : date;
    } catch (e){
        date = null;
    }
    return date;
}

function DateFormatZero(str){
    str = str.toString();
    return str.length == 1 ? '0' + str : str;
}

export {
    FormatDate,
    DateFormatZero,
    ParseDate
}